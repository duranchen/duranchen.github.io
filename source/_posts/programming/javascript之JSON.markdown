---
layout: "post"
title: "Javascript之JSON"
date: "2016-07-21 22:01:08 +0800"
categories: programming
---

# Javascript之JSON

## 什么是JSON

JSON的全称是Javascript Object Notation， 是一种轻量级数据交换格式。

## JSON的数据类型

实际上JSON就是Javascript的一个子集，所以它的数据类型和Javascript基本一样，类型也比较少.

- number = javascript的number
- boolean = javascript的boolean
- string = javascript的string
- null = javascript的null
- array = javascript的array
- object = javascript的object

作为一种数据交换格式，**为了能统一解析，规定了字符串和对象的键值必须用双引号“”**。

## 如何在Javascript中使用JSON？

### 序列化

把数据放入一个Javascript对象，再把该对象序列化成一个JSON格式的字符串——序列化，然后通过网络传递到其他系统。
```javascript
var jim = {
  name: 'Jim',
  'age':21,
  skills:['html','css','php','javascript'],
}

j = JSON.stringify(jim,null,'  ');
console.log(j);
// {
//   "name": "Jim",
//   "age": 21,
//   "skills": [
//     "html",
//     "css",
//     "php",
//     "javascript"
//   ]
// }
```
### 反序列化

当收到的JSON格式的字符串时，把字符串反序列化成一个JSON对象，就可以在Javascript中直接使用了
```javascript
rj = '{"name": "Jim","age": 21,"skills": ["html","css","php","javascript"]}';

obj = JSON.parse(rj);

console.log(obj);

// { name: 'Jim',
//   age: 21,
//   skills: [ 'html', 'css', 'php', 'javascript' ] }
```
