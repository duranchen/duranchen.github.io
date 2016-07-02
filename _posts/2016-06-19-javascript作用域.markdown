---
layout: "post"
title: "Javascript作用域"
date: "2016-06-19 17:24 +0800"
---
## 什么是作用域？
作用域就是一个变量在代码中可以使用的范围。


## Javascript的作用域
1. 用var定义的变量

  当在一个函数中用var声明一个变量，那么这个变量的作用域就是这个函数内。

  也就是这个变量只能在这个函数内可以使用，函数外部不可以使用。

  同样，在这个函数内定义的函数也可以使用这个变量。

2. 不用var定义的变量

  在函数内不用var定义的变量的作用域将不限制在这个函数内。

  Javascript将回溯作用域链，直到找到这个变量初次被定义的地方。

  如果回溯到window作用域都没有找到，这个变量将被赋予全局作用域。
## 函数作用域示例

### 函数内可以访问函数外变量

因为该函数在这个变量的作用域内。

```javascript
var message = 'hello';

var sayHello = function() {
  console.log(message);
}

sayHello(); //logs 'hello'

console.log(message); //logs 'hello'
```

### 函数外不可以访问函数内变量
因为该变量的作用域只在函数内。
```javascript
var sayHello = function(){
  var message = 'goodbye';
  console.log(message)
}

sayHello(); //logs 'goodbye'

console.log(message); // error
```
