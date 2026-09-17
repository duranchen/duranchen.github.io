---
layout: "post"
title: "javascript闭包"
date: "2016-07-21 07:43:35 +0800"
categories: programming
tags:
- javascript
---

# javascript闭包

## 什么是闭包？

高阶函数除了可以接受一个或多个函数作为参数，还可以返回一个函数作为结果。

当一个函数和它的返回函数满足下面情况，就是闭包。

1. 函数A的返回值是函数B；
2. 当函数A返回函数B时， 函数B引用了函数A内的变量；
3. 函数B并不是马上执行，而是在调用B()后执行

## 示例

在购物时，所有商品的价格加起来的总价超过目标金额是，给予警告。
```javascript
function warnAmount(amount) {  //函数A
  count = 0;
  return function(price) { //函数B 匿名函数, 函数B引用函数A的count变量和amount变量
    count += price;
    console.log('count: '+count);
    if(count>amount){
      console.log('High price reached:'+count);
    }
  }
}

add = warnAmount(10); //调用函数A，返回函数B，并将函数B赋值给变量add，

// 通过B()调用函数B,add()
add(1);  // count: 1
add(2);  // count: 3
add(3);  // count: 6
add(4);  // count: 10
add(5);  // count: 15  High price reached:15
```
## 注意

在五次调用函数B-add(price)过程中，变量count和变量amount一直保存着他们的状态，  
而在函数A之外，是不可以访问变量count和变量amount，  
就像_面向对象编程中的私有变量。

从这个角度可以看出来，**闭包就是携带状态的函数，并且它的状态可以对外隐藏起来。**

所以我们也可以利用闭包在没有类特性的javascript中实现面向对象中编程中对象的私有变量。
