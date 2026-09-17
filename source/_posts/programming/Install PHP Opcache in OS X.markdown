---
layout: "post"
title: "Install PHP Opcache in OS X"
date: "2016-08-21 00:31:16 +0800"
categories: programming
---

# Install PHP Opcache in OS X

## Install command
```plain
brew install php56-opcache
```
## Configure Opcache
```plain
sudo vim /usr/local/etc/php/5.6/conf.d/ext-opcache.ini
```
### configure content
```plain
opcache.validate_timestamps = 1 // "0" in production
opcache.revalidate_freq = 0
opcache.memory_consumption = 64
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 4000
opcache.fast_shutdown = 1
```
