---
layout: "post"
title: "Slim容器分析"
date: "2016-08-06 22:39:15 +0800"
categories: programming
---

# Slim容器分析

5年前，我还没什么编程经验，第一次接触java的spring框架，了解容器容器的概念，立刻被它巧妙的设计所惊呆，没错，就是惊呆…没想到程序居然可以这么写！！

不是从上至下的命令式编程，不是分而治之的结构式编程，也不是我当时水平所认知的自底向上，相互作用的对象式编程，而是可复用，可替换的组件化编程。

后来一直做PHP Web应用开发，也没机会用Spring做一些应用，一直在想PHP什么时候也能有使用容器的框架就好了。

一次偶然机会，在一个技术qq群，有人推荐一个叫Slim的框架，我随手打开github，看看这个框架源码，又惊呆了，Slim里有容器，而且惊叹现在的PHP框架怎么越来越像Java Web的框架，有容器，有组件，全OOP。

Slim的源代码地址[Github](https://github.com/slimphp/Slim)

附Slim资料链接：

- [Website](http://www.slimframework.com)
- [Documentation](http://www.slimframework.com/docs/start/installation.html)
- [Support Forum](http://help.slimframework.com)
- [Twitter](https://twitter.com/slimphp)
- [Resources](https://github.com/xssc/awesome-slim)

以日志组件为例，来看看PHP是怎么配置组件，怎么讲组件注入容器，怎么实例化组件，以及何时实例化组件和调用组件的方法？

## 入口文件

Slim/public/index.php

所有请求都是发送给入口文件，然后由入口文件分发请求到相应的服务，入口文件很简单，我截取了和主题相关的部分。
```php
<?php
// 包含应用配置文件
$settings = require __DIR__ . '/../src/settings.php';

// 初始化应用
$app = new \Slim\App($settings);

// 注入应用所依赖组件
// Set up dependencies
require __DIR__ . '/../src/dependencies.php';
```
## 配置组件

Slim/src/settings.php

其中就包含了logger组件的配置信息：  
日志组件的名字：slim-app  
日志组件的log记录保存的位置：__DIR__ . ‘/../logs/app.log’,
```php
<?php
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => __DIR__ . '/../logs/app.log',
        ],
    ],
];
```
## 注入组件 - 依赖注入

应用初始化之后，开始向容器注入应用所依赖的组件。  
在Slim/src/dependencies.php里面定义了应用所依赖的组件，比如模板组件、日志组件、数据库组件等等。

我们就取其中logger组件来分析分析
```php
<?php
// monolog
$container['logger'] = function ($container) {
    $settings = $container->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], Monolog\Logger::DEBUG));
    return $logger;
};
```
这里将一个回调函数赋值给一个容器实例的“logger”属性，

研究一下这个回调函数：

回调函数的参数是一个容器实例，回调函数体通过这个容器实例获取logger组件的配置信息，根据配置信息实例化组件，最后返回这个组件实例。

将这样一个实例化组件的回调函数交给容器，就实现logger组件的注入——这种注入，通过回调函数注入依赖是依赖注入的一种实现方法。

这也是控制反转的一种实现，把原本由应用程序实例化组件，交给了低层容器去做。

## 实例化组件

那么把实例化得控制权交给容器，那么容器什么时候实例化组件呢?

答案是，在第一次调用组件的时候。

Slim/src/routes.php
```php
<?php
app->get('/[{name}]', function ($request, $response, $args) {

    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});
```
在执行下面语句时，如果logger组件没有实例化，就实例logger组件，将实例保存在容器中，并且返回logger组件实例；如果容器中已经有logger组件的实例，就返回该实例——单例模式。
```php
<?php
  $this->logger->info("Slim-Skeleton '/' route");
```
$this指向容器，这里使用了php的魔术方法__get()去获取容器的内的属性。

Slim/vendor/slim/slim/Slim/Container.php
```php
<?php
/********************************************************************************
 * Magic methods for convenience
 *******************************************************************************/

public function __get($name)
 {
     return $this->get($name);
 }
```
最后调用下面方法放回logger组件的实例。
```php
<?php
public function offsetGet($id)
   {
       if (!isset($this->keys[$id])) {
           throw new \InvalidArgumentException(sprintf('Identifier "%s" is not defined.', $id));
       }

       if (
           isset($this->raw[$id])
           || !is_object($this->values[$id])
           || isset($this->protected[$this->values[$id]])
           || !method_exists($this->values[$id], '__invoke')
       ) {
           return $this->values[$id];
       }

       if (isset($this->factories[$this->values[$id]])) {
           return $this->values[$id]($this);
       }

       $raw = $this->values[$id];
       $val = $this->values[$id] = $raw($this);
       $this->raw[$id] = $raw;

       $this->frozen[$id] = true;

       return $val;
   }
```
其中最关键是这一句
```php
<?php
   $val = $this->values[$id] = $raw($this);
```
$raw是前面提到的logger的回调函数，通过$raw($this)去调用回调函数，返回logger组件的实例。

紧接着做了两件事：

一是赋值给$this->values[$id]，作为一个单例保存在容器中，之后再次调用logger组件时，直接返回这个单例。

二是将logger组件实例赋值给$val,作为整个方法的返回值，返回到logger组件的调用处，也就是回到了之前调用logger组件的info()方法处，见下面代码，这样就能写日志到app.log文件里了，

Slim/src/routes.php
```php
<?php
  $this->logger->info("Slim-Skeleton '/' route");
```
## 现代制造工业模式

容器组件化编程，让我想起现代制造工业模式，比如汽车制造业。

最初汽车制造商所有汽车零件都是自己生产组装。

现代汽车厂商已经将汽车零件外包给第三方工厂。

汽车制造商只需要与第三方工厂签到合同，提供标准。

第三方工厂自行安排具体的零件生产工作。

汽车制造商需要汽车时，就从第三方工厂取货，组装汽车。

在这里汽车制造商就是就是容器，汽车就是应用程序，汽车零件就是组件。

看来不仅面向对象编程是对现实的抽象，**软件设计思想也是来源现实世界的抽象**

最后总结下来，Slim容器有2个特点：

- 使用回调函数实现依赖注入，达到控制反转的目的。
- 在使用组件时，才实例化组件，并单例化。
