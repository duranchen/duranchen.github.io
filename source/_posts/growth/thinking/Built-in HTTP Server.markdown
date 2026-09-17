---
layout: "post"
title: "Built-in HTTP Server"
date: "2016-08-21 00:31:16 +0800"
categories:
- growth
- thinking
---

# Built-in HTTP Server

## Start the Server

navigate to your project’s document root directory.

## local machine access
```plain
php -S localhost:4000
```
## other machine access
```plain
php -S 0.0.0.0:4000
```
## Configure the Server
```plain
php -S localhost:8000 -c app/config/php.ini
```
keep the php.ini in project’s directory,  
it will make you easy to share wiht other developers.
