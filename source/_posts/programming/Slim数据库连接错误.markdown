---
layout: "post"
title: "Slim数据库连接错误"
date: "2016-08-06 22:39:15 +0800"
categories: programming
---

# Slim数据库连接错误

## 现象
```plain
Slim Application Error
The application could not run because of the following error:

Details

Type: PDOException
Code: 2002
Message: SQLSTATE[HY000] [2002] No such file or directory
File: /Users/duranchen/Sites/Slim/vendor/illuminate/database/Connectors/Connector.php
Line: 55
Trace

#0 /Users/duranchen/Sites/Slim/vendor/illuminate/database/Connectors/Connector.php(55): PDO->__construct('mysql:host=loca...', 'root', '1', Array)
#1 /Users/duranchen/Sites/Slim/vendor/illuminate/database/Connectors/MySqlConnector.php(24): Illuminate\Database\Connectors\Connector->createConnection('mysql:host=loca...', Array, Array)
#2 /Users/duranchen/Sites/Slim/vendor/illuminate/database/Connectors/ConnectionFactory.php(61): Illuminate\Database\Connectors\MySqlConnector->connect(Array)
#3 [internal function]: Illuminate\Database\Connectors\ConnectionFactory->Illuminate\Database\Connectors\{closure}()
#4 /Users/duranchen/Sites/Slim/vendor/illuminate/database/Connection.php(908): call_user_func(Object(Closure))
#5 /Users/duranchen/Sites/Slim/vendor/illuminate/database/Connection.php(776): Illuminate\Database\Connection->getPdo()
#6 /Users/duranchen/Sites/Slim/vendor/illuminate/database/Connection.php(661): Illuminate\Database\Connection->reconnectIfMissingConnection()
#7 /Users/duranchen/Sites/Slim/vendor/illuminate/database/Connection.php(342): Illuminate\Database\Connection->run('select * from `...', Array, Object(Closure))
#8 /Users/duranchen/Sites/Slim/vendor/illuminate/database/Query/Builder.php(1583): Illuminate\Database\Connection->select('select * from `...', Array, true)
#9 /Users/duranchen/Sites/Slim/vendor/illuminate/database/Query/Builder.php(1569): Illuminate\Database\Query\Builder->runSelect()
#10 /Users/duranchen/Sites/Slim/src/routes.php(18): Illuminate\Database\Query\Builder->get()
#11 [internal function]: Closure->{closure}(Object(Slim\Http\Request), Object(Slim\Http\Response), Array)
#12 /Users/duranchen/Sites/Slim/vendor/slim/slim/Slim/Handlers/Strategies/RequestResponse.php(41): call_user_func(Object(Closure), Object(Slim\Http\Request), Object(Slim\Http\Response), Array)
#13 /Users/duranchen/Sites/Slim/vendor/slim/slim/Slim/Route.php(325): Slim\Handlers\Strategies\RequestResponse->__invoke(Object(Closure), Object(Slim\Http\Request), Object(Slim\Http\Response), Array)
#14 /Users/duranchen/Sites/Slim/vendor/slim/slim/Slim/MiddlewareAwareTrait.php(116): Slim\Route->__invoke(Object(Slim\Http\Request), Object(Slim\Http\Response))
#15 /Users/duranchen/Sites/Slim/vendor/slim/slim/Slim/Route.php(297): Slim\Route->callMiddlewareStack(Object(Slim\Http\Request), Object(Slim\Http\Response))
#16 /Users/duranchen/Sites/Slim/vendor/slim/slim/Slim/App.php(443): Slim\Route->run(Object(Slim\Http\Request), Object(Slim\Http\Response))
#17 /Users/duranchen/Sites/Slim/vendor/slim/slim/Slim/MiddlewareAwareTrait.php(116): Slim\App->__invoke(Object(Slim\Http\Request), Object(Slim\Http\Response))
#18 /Users/duranchen/Sites/Slim/vendor/slim/slim/Slim/App.php(337): Slim\App->callMiddlewareStack(Object(Slim\Http\Request), Object(Slim\Http\Response))
#19 /Users/duranchen/Sites/Slim/vendor/slim/slim/Slim/App.php(298): Slim\App->process(Object(Slim\Http\Request), Object(Slim\Http\Response))
#20 /Users/duranchen/Sites/Slim/public/index.php(32): Slim\App->run()
#21 {main}
```
## 解决
```plain
DurandeMacBook-Pro:phpproject duranchen$ sudo find / -name mysql.sock
Password:
find: /dev/fd/3: Not a directory
find: /dev/fd/4: Not a directory
/private/tmp/mysql.sock
DurandeMacBook-Pro:phpproject duranchen$ sudo mkdir /var/mysql
DurandeMacBook-Pro:phpproject duranchen$ ls /var/mysql/
DurandeMacBook-Pro:phpproject duranchen$ sudo ln -s /private/tmp/mysql.sock /var/mysql/mysql.sock
```
