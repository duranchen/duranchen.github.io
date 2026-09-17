---
layout: "post"
title: "javascript之创建对象"
date: "2016-07-26 08:04:48 +0800"
categories: programming
---

# javascript之创建对象

学过面向对象编程的同学一定都知道，**类是对象的模板，对象是根据模板创建的。**

可是Javascript中没有类的概念，只有对象的概念，没有类怎么创建对象呢？

下面介绍两种创建javascript对象方法：

- 直接赋值法
- 构造函数法

## 赋值法
```javascript
var shopProduct = {
    title:'上衣', // 对象的属性
    "brand":"优衣库",
    'price':300,   //key可以加引号或者双引号。
    getSunmary:function(){ //对象的方法
      return "titile: "+this.title+", brand: "+this.brand+", price: "+this.price;
    }
}

// 输出对象属性
console.log(shopProduct.title);
console.log(shopProduct.price);
console.log(shopProduct.brand);
```
## 构造函数法

先定义一个函数，然后用关键字new调用它，就会得到一个对象。
```javascript
function  ShopProduct(name,brand,price)
{
    this.name =name;
    this.brand= brand;
    this.price = price;
    this.getSunmary = function(){
      return "titile: "+this.name+", brand: "+this.brand+", price: "+this.price;
    };

    return this;

}

shoes = new ShopProduct('shoes','nike',500);

console.log(shoes.name);
console.log(shoes.price);
console.log(shoes.brand);
console.log(shoes.getSunmary());
```
注意：

1. 构造函数中的this指向新对象。
2. 构造函数中虽然没有return，但是默认返回this。
