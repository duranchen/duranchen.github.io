---
layout: post
title:  "怎么样在github pages上搭建Jekyll博客？"
date:   2016-04-02 20:37:55 +0800
categories: method
---

### 0. 最终效果

 请看[JekyII blog]( http://duranchen.github.io) http://duranchen.github.io

博客的主要是是功能：
1. 写博客
2. 可评论

下面先建立博客，然后加评论功能。


### 1. 在github上创建一个Repo

   在浏览中登陆github，创建一个新Repo，命名为'username.github.io'，这里username就是你在github的账户名。

### 2. 安装JekyII

请参考[setting-up-your-github-pages-site-locally-with-jekyll](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/)

如果有错误，需要安装ruby DevKit，请参考https://github.com/oneclick/rubyinstaller/wiki/Development-Kit

### 3. 配置 Jekyll

请参考https://help.github.com/articles/configuring-jekyll/

```yaml
 github: [metadata]
 kramdown:
   input: GFM # Enable GitHub Flavored Markdown (fenced code blocks)
   hard_wrap: false
 gems:
   - jekyll-coffeescript
   - jekyll-paginate
```

特别注意
**input: GFM # Enable GitHub Flavored Markdown (fenced code blocks)**

### 4. 如何写博客

1. Jekyll Post Format, 请参考[http://jekyllrb.com/docs/frontmatter/](http://jekyllrb.com/docs/frontmatter/)

   ```
   ---
   title: This is my title
   layout: post
   ---

   Here is my page (GitHub Flavored Markdown ).
   ```

2. Post内容写法，请参考GitHub Flavored Markdown写法。https://guides.github.com/features/mastering-markdown/

### 5. 添加comments功能

请参考https://help.disqus.com/customer/portal/articles/472138-jekyll-installation-instructions

1. 在https://disqus.com/admin/signup/ 注册一个账户和讨论站点。

2. Add a variable called `comments` to the [YAML Front Matter](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter) and set its value to `true`. A sample front matter might look like:

  ```
  ...
  layout: default
  comments: true
  # other options
  ...
  ```

1. In between a `{% if post.comments %}` and a `{% endif %}` tag, add the[Universal Embed Code](http://docs.disqus.com/developers/universal/) in the appropriate template where you'd like Disqus to load.

   *Comments can be disabled per-page by setting `comments: false` or by not including the `comments` option at all.*

### 6.本地预览
 ```shell
 $ bundle exec jekyll serve
 ```
