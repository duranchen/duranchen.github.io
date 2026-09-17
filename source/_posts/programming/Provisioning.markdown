---
layout: "post"
title: "Provisioning"
date: "2016-09-06 00:10:03 +0800"
categories: programming
tags:
- Server
---

# Provisioning

## Server Setup

### First login
```plain
ssh root@192.168.1.1
```
### Software Udapte
```plain
yum update
```
### Nonroot User
```plain
adduser deploy

passwd deploy

usermod -a -G wheel deploy
```
### SSH Key-Pair Authentication
```plain
ssh deploy@192.168.1.1
```
in your local machine if you do not have key-Pair
```plain
ssh-keygen
```
private key: ~/.ssh/id_rsa  
public key: ~/.ssh/id_rsa.pub
```plain
scp -P 28705 ~/.ssh/id_rsa.pub deploy@192.168.1.1:
```
if ~/.ssh does not exist in your server, create it.
```plain
mkdir ~/.ssh
touch ~/.ssh/authorized_keys
cat ~/id_rsa.pub >> ~/.ssh/authorized_keys

chown -R deploy:deploy ~/.ssh;
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```
### Disable Password and Root Login
```plain
vi /etc/ssh/sshd_config
```
edit settings as the bellow values.
```plain
PasswordAuthentication no
PermitRootLogin no
```
```plain
service sshd restart
```
## PHP-FPM

### Install
```plain
rpm -Uvh https://dl.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

rpm -Uvh https://dl.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

yum -y --enablerepo=epel,remi,remi-php56 install php-fpm php-cli php-gd php-mbstring php-mcrypt php-mysqlnd php-opcache php-pdo php-devel
```
### Global Configuration
```plain
vim /etc/php-fpm.conf
```
```plain
emergency_restart_threshold = 10
emergency_restart_interval = 1m
```
### Pool Configuration
```plain
vim /etc/php-fpm.d/www.conf
```
```plain
user = deploy
group = deploy
listen = 127.0.0.1:9000
listen.allowed_clients = 127.0.0.1
pm.max_children = 25
pm.start_servers = 2
pm.min_spare_servers =2
pm.max_spare_servers = 4
pm.max_requests = 500
slowlog = /var/log/php-fpm/www-slow.log
request_slowlog_timeout = 5s
```
```plain
service php-fpm restart
```
## nginx

### install
```plain
yum install nginx
```
```plain
vim /etc/nginx/conf.d/example.conf
```
```plain
server {
    listen 80;
    server_name example.com;
    index index.php;
    client_max_body_size 50M;
    error_log /home/deploy/apps/logs/example.error.log;
    access_log /home/deploy/apps/logs/example.access.log;
    root /home/deploy/apps/example.com/current/public;

    location / {
        try_files $uri $uri/ /index.php$is_args$args;
    }

    location ~ \.php {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param SCRIPT_NAME $fastcgi_script_name;
        fastcgi_index index.php;
        fastcgi_pass 127.0.0.1:9000;
    }
}
```
```plain
service nginx restart
```
in your local machine
```plain
vim /etc/hosts
```
add new line as below:
```plain
192.168.1.1 example.com
```
visit in your browser: example.com
