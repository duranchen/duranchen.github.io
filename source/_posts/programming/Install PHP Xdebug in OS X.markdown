---
layout: "post"
title: "Install PHP Xdebug in OS X"
date: "2016-08-21 00:32:19 +0800"
categories: programming
---

# Install PHP Xdebug in OS X

## Install Command
```plain
brew install php56-xdebug
```
## Configure Xdebug
```plain
sudo vim /usr/local/etc/php/5.6/conf.d/ext-xdebug.ini
```
### Configure Content
```plain
xdebug.remote_enable = on
```
