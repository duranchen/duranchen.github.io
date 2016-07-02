---
layout: "post"
title: "使用sql进行CRUD操作（MySQL Version）"
date: "2016-04-16 08:47 +0800"
categories: Method
---
示例数据库：[sakila database](http://downloads.mysql.com/docs/sakila-db.tar.gz)，[详细介绍](http://dev.mysql.com/doc/sakila/en/)。

所谓CRUD操作是指对数据库的数据进行Create，Read，Update，Delete操作，下面我们一一介绍：
1. Create

 新建数据，即插入数据。

 ```
 INSERT [into] table [(column1,column2,column3,...)] VALUES
 (value1, value2, value3,...);
 ```

2. Read

 读取数据，即查询数据。

 ```
 SELECT [options] items
 [into file_details]
 FROM tables
 [WHERE conditions]
 [GROUP BY group_type]
 [HAVING where_definition]
 [ORDER BY order_type]
 [LIMIT limit_criteria]
 [PROCEDURE proc_name(arguments)]
 [lock_options];
 ```

 除此之外，还有多表查询和子查询。

3. Update

 更新数据。

 ```
 UPDATE [LOW_PRIORITY] [IGNORE] tablename
 SET column1=expression1,column2=expression2,...
 [WHERE condition]
 [ORDER BY order_criteria]
 [LIMIT number]
 ```

4. Delete
  删除数据。

  ```
  DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM table
  [WHERE condition]
  [ORDER BY order_cols]
  [LIMIT number]
  ```
