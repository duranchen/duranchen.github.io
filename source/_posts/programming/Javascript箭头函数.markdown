---
layout: "post"
title: "Javascript箭头函数"
date: "2016-07-19 21:37:12 +0800"
categories: programming
tags:
- javascript
---

# Javascript箭头函数

## 什么是箭头函数

ES6新增一种函数：箭头函数，箭头函数相当于匿名函数
```plain
x=>x+y
```
等同于
```javascript
function(x) {
  return x+y;
}
```
当有多个参数，多条语句时
```javascript
var f = (x,y)=>{

  if(x>y) {
    return 1;
  }

  if(x<y){
    return -1;
  }

  return 0;
}

console.log(f(1,3));
```
