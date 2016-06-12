---
layout: post
title:  "怎么样在github pages上搭建JekyII blog？"
date:   2016-04-02 20:37:55 +0800
categories: method
---

### 0. 最终效果

 请参考[JekyII blog]( http://duranchen.github.io) http://duranchen.github.io

界面比较简陋，主要是是功能：1 .写博客，2.可评论。


### 1. 建立github repo和站点

官方文档最权威，请参考[github pages](https://pages.github.com)

1. Create a repository

   Head over to GitHub and create a new repository named 'username.github.io', where username is your username (or organization name) on GitHub.

2. Clone the repository

   Go to the folder where you want to store your project, and clone the new repository:

   ```shell
   ~$git clone https://github.com/username/username.github.io
   ```

3. Hello World

   Enter the project folder and add an index.html file:

   ```shell
   ~$cd username.github.io
   ~$echo "Hello World" > index.html
   ```

4. #### Push it

   Add, commit, and push your changes:

   ``` shell
   ~$git add --all

   ~$git commit -m "Initial commit"

   ~$git push -u origin master
   ```

5. #### …and you're done!

   Fire up a browser and go to **http://username.github.io**.

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

### 4. Blogging with Jekyll

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
