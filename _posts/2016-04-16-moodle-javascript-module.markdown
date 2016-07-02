---
layout: "post"
title: "Moodle javascript Module"
date: "2016-04-16 14:28 +0800"
---
## 1 Javascript Modules

Reference： https://docs.moodle.org/dev/Javascript_Modules

### 1.1 What is a Javascript module?

A collection of Javascript code

### 1.2 Why should I package my code as a module?

To break your code up to smaller reusable pieces

* easy to understand
* easy to test
* easy to reuse

## 2 How do I write a Javascript module in Moodle?

Javascript Mouldes is written by using the Asynchronnous Module Definition API.

To edit or create an AMD module in Moodle you need to do a couple of things below.

### 2.1 Install grunt

1. install [nodejs](https://nodejs.org/en/)
2. install npm and grunt in terminal

```
npm install
npm install -g grunt-cli
```


### 2.2 Running grunt

Enter into the root of moodle document and run grunt command

```
cd moodle/
grunt jshint uglify
```

### 2.3 "Hello World" I am a Javascript Module

1. creat block_nae_board.
2. put the js file under 'blocks/block_nae_board/amd/src/helloworld.js'.
3. put the following code in helloworld.js


```javascript
define(['jquery', 'core/log'], function($, log) {
    return {
        init: function() {
            $(document).ready(function($) {
                alert('hello,World!');
            });
            log.debug('helloword AMD init');
        }
    };
});
```
```
define(['jquery', 'core/log'], function($, log) {
```
The first argument to "define" is the list of dependencies for the module. This argument can be an array.

The second argument to "define" is the function that defines the module. The arguments are from the first argument with the same order.

```
  return {
        init: function() {
            $(document).ready(function($) {
                alert('hello,World!');
            });
            log.debug('Essential jBreadCrumb AMD init');
        }
    };
```

The code returns a Object which includes a method called 'init'. the rest of the code are jQurey code, which will pop a warning 'hello,World!'.



### 2.4 Embedding AMD code in a page

Using "js_call_amd" to call a single function from an AMD module with parameter
```
$PAGE->requires->js_call_amd($modulename, $functionname, $params);
```

```
$this->page->requires->js_call_amd('block_nae_board/helloworld','init');
```
it means calling the function 'init' in the module'block_nae_board/helloworld'

### 2.5 But I have a mega JS file I don't want loaded on every page?

You can rename the javascript file to end with the suffix "-lazy.js" which indicates that the module will not be loaded by default, it will be requested the first time it is used.
