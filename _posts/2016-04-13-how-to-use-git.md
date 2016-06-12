---
layout: post
title:  "How to Use Git"
date:   2016-04-02 20:37:55 +0800
categories: method
---

本文参考[阮一峰 - Git 使用规范流程](http://www.ruanyifeng.com/blog/2015/08/git-use-process.html)

团队开发中，遵循一个合理、清晰的Git使用流程，是非常重要的。

否则，每个人都提交一堆杂乱无章的commit，项目很快就会变得难以协调和维护。

## 第零步：克隆远程仓库

```shell
$ git clone git@gitlab.moodle.nordanglia.com:moodle/school.git
```

## 第一步：新建issue和分支

首先，每次开发新功能或者修复bug，都应该新建一个issue和一个单独的分支。

分支命名应该以issue number开头，例如1-feature-isams-integration，24-bug-require-parameter。

```shell
# 获取production最新代码
$ git checkout production_29
$ git pull

# 新建一个开发分支1-feature-name，
$ git checkout -b 1-feature-name
```

## 第二步：提交分支commit

分支修改后，就可以提交commit了。

```shell
$ git add .
$ git status
$ git commit --verbose
```

git status 命令，用来查看发生变动的文件。
git diff  命令，用来查看详细改动。  
git commit 命令的verbose参数，会列出 diff 的结果。  

## 第三步：撰写提交信息

提交commit时，必须给出完整扼要的提交信息，下面是一个范本。

```shell
Present-tense summary under 50 characters

More information about commit (under 72 characters).

issue name  #issue number
```

第一行是不超过50个字的提要，然后空一行，罗列出改动原因、主要变动、以及需要注意的问题。

最后，提供对应的issue的name和number（比如iSAMS integration #1）。

## 第四步：与主干同步

分支的开发过程中，要经常与主干保持同步。

```shell
# 获取远程production最新代码
$ git fetch origin

# 本地合并production的到当前分支，并把你的commits放在最后面。
$ git rebase origin/production_29
```

## 第五步：合并commit

分支开发完成后，很可能有一堆commit，但是合并到主干的时候，往往希望只有一个（或最多两三个）commit，这样不仅清晰，也容易管理。

那么，怎样才能将多个commit合并呢？这就要用到 git rebase 命令。
　
```shell
$ git rebase -i origin/production_29
```

git rebase命令的i参数表示互动（interactive），这时git会打开一个互动界面，进行下一步操作。

下面采用[Tute Costa](https://robots.thoughtbot.com/git-interactive-rebase-squash-amend-rewriting-history)的例子，来解释怎么合并commit。

```shell
pick 07c5abd Introduce OpenPGP and teach basic usage
pick de9b1eb Fix PostChecker::Post#urls
pick 3e7ee36 Hey kids, stop all the highlighting
pick fa20af3 git interactive rebase, squash, amend

# Rebase 8db7e8b..fa20af3 onto 8db7e8b
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

上面的互动界面，先列出当前分支最新的4个commit（越下面越新）。

每个commit前面有一个操作命令，默认是pick，表示该行commit被选中，要进行rebase操作。

4个commit的下面是一大堆注释，列出可以使用的命令。

pick：正常选中  
reword：选中，并且修改提交信息；  
edit：选中，rebase时会暂停，允许你修改这个commit（参考这里）  
squash：选中，会将当前commit与上一个commit合并  
fixup：与squash相同，但不会保存当前commit的提交信息  
exec：执行其他shell命令　　

上面这6个命令当中，squash和fixup可以用来合并commit。

先把需要合并的commit前面的动词，改成squash（或者s）。　　

```shell
pick 07c5abd Introduce OpenPGP and teach basic usage
s de9b1eb Fix PostChecker::Post#urls
s 3e7ee36 Hey kids, stop all the highlighting
pick fa20af3 git interactive rebase, squash, amend
```

这样一改，执行后，当前分支只会剩下两个commit。

第二行和第三行的commit，都会合并到第一行的commit。提交信息会同时包含，这三个commit的提交信息。  

```shell
# This is a combination of 3 commits.
# The first commit's message is:
Introduce OpenPGP and teach basic usage

# This is the 2nd commit message:
Fix PostChecker::Post#urls

# This is the 3rd commit message:
Hey kids, stop all the highlighting
```

如果将第三行的squash命令改成fixup命令。

```shell
pick 07c5abd Introduce OpenPGP and teach basic usage
s de9b1eb Fix PostChecker::Post#urls
f 3e7ee36 Hey kids, stop all the highlighting
pick fa20af3 git interactive rebase, squash, amend
```

运行结果相同，还是会生成两个commit，第二行和第三行的commit，都合并到第一行的commit。

但是，新的提交信息里面，第三行commit的提交信息，会被注释掉。  

```shell
# This is a combination of 3 commits.
# The first commit's message is:
Introduce OpenPGP and teach basic usage

# This is the 2nd commit message:
Fix PostChecker::Post#urls

# This is the 3rd commit message:
# Hey kids, stop all the highlighting
```

## 第六步：推送到远程仓库

合并commit后，就可以推送当前分支到远程仓库了。

```shell
$ git push --force origin 1-feature-name
```

git push命令要加上force参数，因为rebase以后，分支历史改变了，跟远程分支不一定兼容，有可能要强行推送（参见这里）。

## 第七步：发出Merge Request

提交到远程仓库以后，就可以发出 Merge Request 到Production_29分支，然后请求别人进行代码review，并部署到Staging Server测试。

## 第八步： 部署
部署到Production Server。

如果一切顺利，合并到Production_29，如果有问题，用production_29的代码回滚。
