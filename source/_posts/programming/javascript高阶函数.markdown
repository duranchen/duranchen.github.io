---
layout: "post"
title: "javascript高阶函数"
date: "2016-07-15 00:08:05 +0800"
categories: programming
tags:
- javascript
---

- [Javascript高阶函数](#javascript高阶函数)
  - [什么是高阶函数？](#什么是高阶函数)
  - [一个简单的高阶函数](#一个简单的高阶函数)
  - [javacritp中的高阶函数](#javacritp中的高阶函数)
    - [map](#map)
    - [reduce](#reduce)
    - [filter](#filter)
    - [sort](#sort)

# Javascript高阶函数

## 什么是高阶函数？

接受另一个函数作为参数的函数，就叫做高阶函数

## 一个简单的高阶函数
```javascript

function compare(a,b,fn)
{
    return fn(a,b);
}

var fn = function (a,b) {
   if(a>b){
     console.log('a>b');
   } else if (a==b){
     console.log('a=b');
   } else {
     console.log('a<b');
   }
}

a =3 ;
b = 2;

compare(a,b,fn);
```
## javacritp中的高阶函数

### map

给数组每个一个字符串元素加一个前缀
```javascript
var fn = function(s) {
  return 'prefix_'+s;
}

var arr =['a','b','c','d'];
var result = arr.map(fn);

console.log(result);
```
### reduce

求数组中所有数值元素的乘积
```javascript
var arr = [1,2,3,4,5];

var result = arr.reduce(function(x,y) {
    return x*y;
}
);

console.log(result);
```
### filter

过滤数组中的空字符串
```javascript
function removeEmpty(arr)
{
  return arr.filter(function(x){
    return x != '';
  })
}

var arr = ['',1,2,3,''];

var result = removeEmpty(arr);

console.log(result);
```
### sort

sort默认是按ASCII码排序，对数值也先转成字符串，再按ASCII排序。  
所以直接使用sort排序，可能得到的意外的结果，但是可以传入一个函数作为参数自定义排序算法。

1. 使数组中的数值按降序排序
```javascript
arr.sort(function(x,y)
{
  if(x<y) {
    return 1;
  }

  if(x>y) {
    return -1;
  }

  return 0;

}
);
```
1. 对数组中的字符串忽略大小写排序
```plain

var arr = ['Google','apple','Microsoft']

arr.sort(function (x,y)
{
  x1 = x.toUpperCase();
  y1 = y.toUpperCase();

  if(x1<y1) {
    return -1;
  }
  if(x1>y1){
    return 1;
  }
  return 0;
}
);

console.log(arr);
```
