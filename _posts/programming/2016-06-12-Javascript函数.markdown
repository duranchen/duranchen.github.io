---
layout: "post"
title: "Javascript函数"
date: "2016-06-12 17:29 +0800"
---
## 什么是JavaScript函数？
在所有编程语言里，函数是用来包含需要重复执行的代码块，Javascript也不例外。

Javascript函数可以有0到n个参数。

Javascript函数可以返回一个值或0个值。

## 如何创建函数？
在JavaScript里，有两种创建函数的方法法。

1. 函数声明法
```javascript
function foo() {
  /* do something */
}
```
2. 函数表达式法
```javascript
var foo = function() {
  /* do something */
}
```

## 如何使用函数？
下面是使用不同类型函数的例子

1. 简单函数
```javascript
var greet = function(person,greeting)
{
  var text = greeting+','+person;
  console.log(text);
};
greet('Duran','Hello');
```

2. 有返回值得函数
```javascript
var greet = function(person, greeting)
{
  var text = greeting+','+person;
  return text;
};
console.log(greet('Duran','Hello'));
```

3. 返回函数的函数
```javascript
var greet = function(person,greeting)
{
  var text = greeting+''+person;
  return function(){console.log(text)};
};
var greeting = greet('Duran','hello');
greeting();
```

## 自执行匿名函数
在javascript中，自执行匿名函数一种随处可见的函数，所以理解它是非常重要的。

它首先建立一个函数表达式，然后立刻执行它。

注意：所有在自执行匿名函数中声明的变量在函数外部都是不可访问的。

```javascript
(function(){
  var foo = 'Hello world';
})()
console.log(foo); //undefined!
```

## 函数作为函数的参数
函数在JavaScript中非常重要，它们被当做一等公民，什么是一等公民？就是它们能被赋值给变量，能作为参数传递给另一个函数。

### 传递匿名函数作为参数
```javascript
var myFn = function(fn) {
  var result =fn();
  console.log(result);
}
myFn(function(){return 'hello world';});
```
### 传递非匿名函数作为参数
```javascript
var myFn = function(fn) {
  var result = fn();
  console.log(result);
}
var myOtherFn = function(){
  return 'hello world';
}
myFn(myOtherFn);
```
