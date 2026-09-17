# 十八般武艺

> 学习思考成长

一个 2016 年的个人学习笔记博客，内容跨编程、英语、理财、成长、健身、新概念等方向。
技术栈是 Hexo 3.2.2 + NexT 5.0.1（Pisces 方案），构建成静态站点后发布到 GitHub Pages。

- 本仓库：https://github.com/duranchen/my-hexo.git（分支 `main`）
- 部署仓库：https://github.com/duranchen/duranchen.github.io.git
- 本地目录：`OneDrive\Project\my-blog`（2026-09-17 由 `my-hexo` 改名而来，**只改了本地文件夹名，远端仓库名仍是 `my-hexo`**）
- 线上域名：https://blog.duranc.cc —— `duranchen.github.io` 会跳转到这个自定义域名

> ⚠️ **本仓库历史上落后于线上，2026-09-17 已追平。**
> 详见下文「线上站点与本仓库的差异」——2026-09-17 把线上多出的 29 篇文章抓了回来（两边内容量一致，各 65 篇）、
> 把 8 篇旧文章的目录搬到与线上相同的位置（**两边共有的 64 篇 URL 已逐字一致**）、
> 并把站点名/副标题统一为线上正在用的「十八般武艺 / 学习思考成长」。
>
> 历史背景：仓库最初叫「德智体美劳」，副标题「小时候经常听，从来没弄懂过。」——那是 2016 年 7 月前的旧名，线上后来改名了。
> 核对方式见下文。

---

## 环境要求

| 依赖 | 版本 | 说明 |
|---|---|---|
| Node.js | 22.22.2（已验证） | Hexo 3.2.2 是 2016 年的包，在新版 Node 上能跑，但需要一处补丁，见下 |
| 依赖包 | 见 `package.json` | `node_modules/` 未提交到 git，换机器或清空后需 `npm install` 重装 |
| 主题 | NexT **5.0.1** | 位于 `themes/next/`，已提交；注意其自带 `package.json` 里 version 仍写 5.0.0，上游 tag 未同步，属正常 |

## 常用命令

Windows 下**没有** `hexo.cmd`（`node_modules/.bin/` 只有 Unix shim），所以一律用 node 直接调：

```bash
# 清空 public/
node node_modules/hexo/bin/hexo clean

# 构建（当前产物：193 个文件 / 约 7 s）
node node_modules/hexo/bin/hexo generate

# 本地预览 → http://localhost:4000
node node_modules/hexo/bin/hexo server

# 部署到 GitHub Pages —— ⚠️ 跑之前务必读下面「部署（`hexo deploy`）」一节
node node_modules/hexo/bin/hexo deploy
```

构建日志里有 14 条 `WARN`，全部是 Node 22 对老代码的提示（`util.isDate` 弃用、swig 引擎访问不存在的 `lineno`/`column` 等），**与输出无关**。判断构建是否正常，看这两个指标就够：

- 出现 `INFO  xxx files generated`，且**没有** `WARN  No layout`（出现即主题没装好）
- `public/` 里**没有 0 字节文件**（出现即需要应用下面的补丁）

---

## ⚠️ 三个必须知道的坑

### 1. `node_modules/hexo` 被打了补丁，重装依赖后必须重新应用

`node_modules/hexo/lib/plugins/console/generate.js` 里加了 `{ autoDestroy: false }`：

```js
function CacheStream() {
  Transform.call(this, { autoDestroy: false });
  this._cache = [];
}
```

**为什么**：Hexo 3.2.2 把 `CacheStream.destroy` 重写成"清空缓存"（本想手动回收内存），而 Node 14 起 stream 的 `autoDestroy` 默认为 `true` —— 流一结束 Node 就自动调 `destroy()`，把刚写好的内容清空。结果是**每个文件都生成 0 字节，Hexo 却退出码 0、不报任何错**（连 CSS、JS、图片都是空文件）。2016 年的 Node 没这个行为，所以当年能跑。

补丁已固化为 `patches/hexo-3.2.2-node-autodestroy.patch`：

```bash
git apply patches/hexo-3.2.2-node-autodestroy.patch
```

**只要动过 `node_modules`，第一件事就是重新应用它，否则整站静默变空壳。**

### 2. 主题不在 npm 上，但已随仓库提供

NexT 5.x 用 `.swig` 模板，需要 `hexo-renderer-swig`（运行时还依赖 `swig-extras`）。这两个包已写进 `package.json`，正常 `npm install` 能拉回。

主题本身在 npm 上不存在，但它**已经作为普通文件提交在本仓库里**（`themes/next` 243 个文件，含定制过的 `_config.yml` 与 GA4 片段）。所以：

- **正常恢复不需要做任何事**，`git clone` 下来就有
- **千万不要再 `git clone` 一次主题**——`themes/next` 已存在且非空，clone 会报错；真要覆盖就等于把仓库里对齐过的主题配置（Pisces / 头像 / 评论 / GA4）一并冲掉

只有确实想把主题还原成上游原始版本时才这么做，并清楚后果：

```bash
rm -rf themes/next
git clone --depth 1 --branch v5.0.1 https://github.com/iissnan/hexo-theme-next.git themes/next
rm -rf themes/next/.git   # 必须删，否则主题被当成子模块、内容不进主仓库
# 之后得手动改回：scheme= Pisces / avatar / disqus / since / google_analytics，
# 以及重做 layout/_scripts/third-party/analytics/google-analytics.swig 的 GA4 改动
```

> 仓库里还有一个 `themes/landscape`（79 个文件）——Hexo 自带的默认主题，本项目没用（`theme: next`），是 2016 年原样留下的。

### 3. 项目在 OneDrive 目录下，且仓库约定 CRLF

- **OneDrive 会锁文件**：编辑 `_config.yml` 之类的文件偶尔会因同步锁写入失败，重试一次即可。
- **行尾符是 CRLF**（2016 年的历史遗留，仓库 `core.autocrlf=true`）。用 LF 重写已有文章会产生"整文件全改"的巨大 diff 噪声，改写时请保持 CRLF。

---

## 目录结构

```
├── _config.yml            站点配置（站点信息、URL、permalink、deploy）
├── package.json           依赖声明
├── .gitignore             Hexo 规则：忽略 node_modules / public / db.json / .deploy_git
├── patches/               兼容性补丁（见上文坑 1）
├── scaffolds/             hexo new 的模板：post / page / draft
├── source/
│   ├── _posts/            文章正文，按分类分子目录（目录名会成为 URL 里的一段）
│   │   ├── programming/      29 篇
│   │   ├── english/          11 篇
│   │   │   └── nce/           3 篇
│   │   ├── growth/            6 篇
│   │   │   └── thinking/      7 篇
│   │   ├── finance/           5 篇
│   │   ├── fitness/           1 篇
│   │   └── (根目录)            3 篇
│   ├── images/            配图（2016/ 存正文图，根目录是头像 avatar.jpg）
│   └── categories/        分类页入口
├── themes/next/           NexT 5.0.1 主题
└── public/                构建产物，已 gitignore（不提交）
```

## 内容说明

65 篇文章，写作时间集中在 2016 年 4–9 月。其中 29 篇是 2026-09-17 从线上站点抓回来的（见「线上站点与本仓库的差异」），其余 36 篇是仓库原有的源文件。

**注意 URL 是由「源文件目录 + 日期 + 文件名」共同决定的**，三者任一改动都会改变线上链接：

- 目录：Hexo 会把 `_posts/` 下的子目录当作分类，并把目录名带进 URL。所以 `_posts/programming/x.md` 的链接是 `/年/月/日/programming/x/`
- 日期：`date` 决定 URL 里的 `年/月/日`
- 文件名：`permalink` 用的是文件名（去掉扩展名），**不是 front-matter 的 title**

改这三者之前先想清楚会不会断链。

分类有两套来源：**目录名**（决定 URL 里的分类段）与 front-matter 的 **`categories`**（决定分类页归属）。现有 30 篇写了 `categories`（生成 7 个分类页），14 篇写了 `tags`（生成 9 个标签页），其余靠目录名。

正文配图原本外链简书图床，现已全部下载到 `source/images/2016/` 并改为相对路径，站点离线自洽。两点注意：

- 图床返回的实际是 **WebP** 格式（不是 PNG/JPEG），文件头是 `RIFF....WEBP`，按 PNG/JPEG 校验会误报
- 其中一张增长曲线图是本地重绘的 SVG（原 Wikimedia 源在当前网络不可达），见 `source/images/2016/exponential-vs-linear-vs-power.svg`

另有 17 篇正文不足 150 字，其中 `Deployment-Capistrano` 与 `2016-04-16-获取数据库信息` **在线上就是空文章**（2016 年发出来就是这样，不是抓取损坏），`my-vocabulary-size` 只有一张表，其余多是动词时态、从网页查询数据库、从文本导入数据到数据库、抽象能力、策略与坚持这类标题或提纲。

## 线上站点与本仓库的差异

这一点容易误判，单看仓库是看不出来的，所以单独说明。

|  | 本仓库（源文件） | 线上站点 |
|---|---|---|
| 站点名 | 十八般武艺（`_config.yml`） | 十八般武艺 |
| 副标题 | 学习思考成长 | 学习思考成长 |
| `description` | ever-growing | ever-growing |
| 篇数 | 65 | 65 |
| 域名 | — | `blog.duranc.cc`（`duranchen.github.io` 301 至此） |
| 构建时的 `url` | `https://duranchen.github.io` | `http://duranchen.github.io`（页面 canonical 可见） |

站点名/副标题已于 2026-09-17 统一到线上正在用的值（原本仓库里是旧名「德智体美劳 / 小时候经常听，从来没弄懂过。」）。
校验方式：构建后从 `public/index.html` 抽 `<title>`、`.site-title`、`.site-subtitle`、`meta[name=description]`，
与线上首页逐字比对（线上首页的 `<title>` 就是裸的「十八般武艺」，文章页是「标题 | 十八般武艺」），并全站扫描确认旧名零残留。

篇数虽然一致，但集合不完全相同：**线上有 Hexo 默认模板文 `hello-world`，本仓库没有**（2026-09-17 清理模板残留时删除）；反过来，**本仓库有 `2016-04-16-创建数据库和用户`，线上没有**——因为它当年缺 `.markdown` 扩展名，从未被渲染上线。

### URL 与线上站点的对齐情况（2026-09-17 已逐条核对）

写了个脚本，把本地构建产物的文章 URL 与线上归档页（7 页 / 65 篇）做集合比对，结论：

- **两边共有的 64 篇，URL 逐字一致**——含中文段与全角标点，例如 `/2016/07/02/growth/thinking/2016-07-02-抽象能力/`、`/2016/04/02/programming/2016-04-02-怎么样在github pages上搭建Jekyll博客/`
- **只在线上有 1 篇**：`/2016/07/02/hello-world/`（Hexo 默认模板文，本仓库刻意不收）
- **只在本地有 1 篇**：`/2016/04/16/programming/2016-04-16-创建数据库和用户/`（当年缺扩展名、从未上线，本仓库刻意保留）

所以**本仓库重建出的链接不会与线上任何真实链接冲突**，唯一差异是两边各自的一篇「编外文章」。

对齐时把 8 篇旧文章用 `git mv` 搬了目录（保留文件历史）：`thinking/` → `growth/thinking/`（5 篇）、`nce/` → `english/nce/`（3 篇）。**URL 由源文件目录决定，目录不搬，链接就永远差一截。**

### 文件名日期与 front-matter 日期不一致的 7 篇

有 7 篇的**文件名日期**与 front-matter 的 `date` 不同：

| 文件 | front-matter `date` | 文件名里的日期 |
|---|---|---|
| `english/2016-06-12-听力和短读.markdown` | 2016-05-21 | 2016-06-12 |
| `english/2016-06-26-如何开始阅读第一本英文原版书--kindle篇.markdown` | 2016-06-27 | 2016-06-26 |
| `english/2016-06-28-形容词.markdown` | 2016-07-09 | 2016-06-28 |
| `finance/2016-06-11-指数基金定投.markdown` | 2016-04-16 | 2016-06-11 |
| `finance/2016-06-30-如何低风险实现资产的指数级增长—复利.markdown` | 2016-07-02 | 2016-06-30 |
| `programming/2016-04-13-how-to-use-git.md` | 2016-04-02 | 2016-04-13 |
| `programming/2016-09-08-开启cors.markdown` | 2016-08-21 | 2016-09-08 |

**不要「顺手」把文件名改成和 `date` 一致。** `permalink` 的 `:title` 取的是**文件名**，改名等于改链接：`/2016/07/09/english/2016-06-28-形容词/` 会变成 `.../2016-07-09-形容词/`，与线上断链。URL 里的日期取的是 front-matter 的 `date`，文件名里的日期只是历史遗留，不进任何输出。

（这条曾被我写成「6 篇的 date 与线上不符」，**是错的**：这 7 篇的 URL 与线上完全一致，只是文件名和 `date` 互相打架。）

其余差异：

1. **`hexo deploy` 有破坏性**：它强推 `public/` 到 `duranchen.github.io` 仓库。**详见下面「部署（`hexo deploy`）」一节**——那里有完整的风险清单与前置检查。
2. **站点名与副标题已统一**（2026-09-17）：现为「十八般武艺 / 学习思考成长」，与线上正在用的一致；仓库旧名「德智体美劳 / 小时候经常听，从来没弄懂过。」是 2016 年 7 月前的历史状态。
3. **`url` 目前填 `https://duranchen.github.io`**：与线上构建时用的值一致（线上页面 canonical 也指向该域名，`blog.duranc.cc` 只是它的自定义域名），所以这个值无需改动。仅 scheme 由 http 变 https，不影响站内链接。

本仓库的价值在于它是**可构建的源文件快照**；线上站点是**成品**。两者不要混为一谈，也不要让一次 `deploy` 把它们的关系搞乱。

## 部署（`hexo deploy`）

```bash
node node_modules/hexo/bin/hexo deploy
```

> **Windows 上没有 `hexo` 裸命令**：`node_modules/.bin/` 里只有给 Unix 用的 `hexo`（无扩展名），没有 `hexo.cmd`。
> 直接敲 `hexo deploy` 会报 `CommandNotFoundException`。必须走上面的 `node node_modules/hexo/bin/hexo`。

`hexo deploy` 的行为（读 `node_modules/hexo-deployer-git/lib/` 源码确认）：

1. 把 `public/` 原样复制进 `.deploy_git/`（先清空该目录）
2. 在 `.deploy_git/` 里 `git commit`，然后 **`git push -u <repo> HEAD:<branch> --force`**

`--force` 意味着**目标分支会变成 `public/` 的镜像**：`public/` 里没有的文件，在线上全部消失。别把它当成「增量发布」。

### ⚠️ 三个曾让部署无声失败的坑（2026-09-17 已修，改动务必保留）

**1. `.deploy_git` 必须自带 `.git` —— `hexo deploy` 曾因此把本仓库源码推上了线上。**

三个坑里唯一真造成过事故的就是这个，也最隐蔽。`node_modules/hexo-deployer-git/lib/deployer.js`：

```js
return fs.exists(deployDir).then(function (exist) {
  if (exist) return;          // setup() 是唯一执行 `git init` 的地方
  return setup();
})...
  return git('push', '-u', repo.url, 'HEAD:' + repo.branch, '--force');
```

所有 git 命令都以 `cwd: .deploy_git` 执行。于是当 `.deploy_git` **目录存在、但没有自己的 `.git`** 时：部署器跳过 `git init`，git 一路向上找到**本仓库**的 `.git`——`git add`/`git commit` 动的是本仓库，最后那句 `--force` 推的是**本仓库的 HEAD**。

而这个状态极容易达成：git 无法保存嵌套的 `.git`，所以一个从版本库里 checkout 出来的 `.deploy_git`（2016 年它曾被提交进本仓库）天然就是「有内容、没 `.git`」——正好是致命的形状。**全程没有任何报错，部署还会「成功」。**

2026-09-17 的实际后果：线上仓库 `duranchen.github.io` 的 `main` 从 `80b4eed`（线上成品）被强推成本仓库的 HEAD，GitHub Pages 的 Jekyll 构建随即失败：

```
github-pages 232 | Error: The next theme could not be found.
```

因为 Jekyll 读到的是本仓库的 Hexo `_config.yml`，里面写着 `theme: next`。（线上站点当时仍提供着最后一次成功部署的版本，所以没有内容损失。）

**修复：`scripts/deploy-guard.js`。** Hexo 会自动加载站点根目录 `scripts/` 下的文件，并把每个文件包成 `(function (exports, require, module, __filename, __dirname, hexo) { ... })` 执行。该脚本挂在 `deployBefore` 上（事件同步触发，早于部署器检查 `.deploy_git`），做三件事：

1. 删掉没有 `.git` 的 `.deploy_git`，让部署器重新走 `setup()` / `git init`
2. 自己 `git init` 并确保有可用的提交身份——否则 `git commit` 会失败，而部署器**把提交失败吞掉**，接着在 unborn HEAD 上推送报错
3. 写入 `.nojekyll`（理由见下面第 3 条）

所以：**别删 `scripts/deploy-guard.js`；也别再把 `.deploy_git` 提交进版本库**（`.gitignore` 已忽略 `.deploy*/`）。

> 那次事故还在本仓库的 `.git/config` 里把 `main` 的上游 `branch.main.remote` 改成了**页面仓库的地址**——于是裸敲 `git push` 会推到页面仓库，等于不跑 deploy 也可能重演事故。现已改回 `origin`（`git push --dry-run` + `GIT_TRACE` 已确认指向 `my-hexo`）。

**2. `branch` 必须显式写成 `main`。**

`_config.yml` 的 `deploy` 段里**只写 `repo` 不写 `branch` 是危险的**。`hexo-deployer-git` 0.2.0 的 `lib/parse_config.js` 有这么一段：

```js
var rGithubPage = /\.github\.(io|com)$/;
if (host === 'github.com') {
  branch = rGithubPage.test(path) ? 'master' : 'gh-pages';
}
```

仓库名 `duranchen.github.io` 命中 `\.github\.io$`，于是**默认推到 `master`**。而这个仓库的 Pages 是从 **`main`** 发布的（`git ls-remote` 可确认）。结果就是：命令报成功、远端多出一个没人用的 `master` 分支，**线上站点一个字都不变**。现已显式写上 `branch: main`。

**3. `source/CNAME` 必须存在；`.nojekyll` 由防护脚本写进 `.deploy_git`。**

线上靠仓库根目录的 `CNAME`（内容 `blog.duranc.cc`）撑起自定义域名。而这个文件**不在 Hexo 的构建产物里**——不补的话，`--force` 会把它删掉，`blog.duranc.cc` 直接失效（线上仓库 2026-09-16 还更新过一次 CNAME，说明它是活的配置）。

已在 `source/CNAME` 存放 `blog.duranc.cc`，构建后会输出到 `public/CNAME`。**改动部署方式时别把这个文件弄丢。**

`.nojekyll` 则必须写进 `.deploy_git`，**不能**放 `source/` 或 `public/`：hexo-fs 的 `emptyDir()` 与 `copyDir()` **默认忽略隐藏文件**（`lib/fs.js`：`ignoreHidden == null ? true : options.ignoreHidden`），放前两处的 `.nojekyll` 永远到不了部署仓库；而写进 `.deploy_git` 的，在「Clearing .deploy_git folder」时会被原样保留，并随站点一起提交。有它，GitHub Pages 才跳过 Jekyll、直接原样提供文件。

（当前产物恰好是 Jekyll 安全的——已核查 `public/` 里没有 `_` 开头的路径、没有任何 `{{ }}` / `{% %}`、也没有 markdown 文件。但这属于运气：哪天写一篇讲 Swig 或 Go 模板的文章，页面上就会出现 `{{ }}`，Jekyll 会去解析它，构建静默失败、站点停在旧版本。）

### 部署会删掉什么（执行前请确认能接受）

线上仓库现有 **220 个文件**，本仓库构建产物是 **193 个**——两边不是简单的包含关系，`--force` 下会有 **45 个线上文件被删除**，主要是：

- **16 个旧版 URL 页面**：作者当年把文章挪进分类目录前留下的，如 `/2016/07/19/Javascript箭头函数/`（不带 `programming/` 段）与 `/2016/07/21/javascript之JSON/` 等。它们的「新地址」都在，但**旧链接会 404**
- `hello-world`（Hexo 模板文）、`2016/测试时间线`
- `css/style.css`、`css/fonts/*`、`css/images/banner.jpg`、`fancybox/*`、`js/script.js`——**Landscape 主题时代的遗留资源**，新页面不再引用
- `_config.yml`（GitHub Pages 的 Jekyll 配置，内容还是没改过的模板占位文字）与 `categories/index.md`

同一批 `public/` 文件里还有 **139 个页面内容与线上不同**，属正常：GA4 替换、`url` 由 http 改 https、版权年份、prev/next 顺序等。

### 部署前置检查

```bash
# 1. 构建干净
node node_modules/hexo/bin/hexo clean && node node_modules/hexo/bin/hexo generate
#    期望：INFO 193 files generated、无 No layout、无 0 字节文件

# 2. 确认 CNAME 在产物里
cat public/CNAME                     # 应输出 blog.duranc.cc

# 3. 确认 deploy 段有 branch: main
grep -A3 '^deploy:' _config.yml

# 4. 备份线上仓库（首次务必做）
git clone https://github.com/duranchen/duranchen.github.io.git /tmp/pages-backup
```

### 备份与「一键撤销」（2026-09-17 事故后新增）

`.workbuddy/backup/` 下有两份东西（该目录被 gitignore，只在本地）：

| 文件 | 内容 | 用途 |
|---|---|---|
| `duranchen-pages-20260917.tar.gz` | 线上仓库的完整 clone，含 `.git` 全部 14 次提交（4.16 MB） | 兜底备份，最坏情况下解包即得完整历史 |
| `duranchen-pages-mirror.git` | 裸镜像，`main` = 事故前的 `80b4eed` | 直接用来执行下面的撤销命令 |

**撤销事故**（把线上 `main` 恢复成事故前的成品 `80b4eed786b53b51c6a4c8ed97b5edcf19bd30bd`）：

```powershell
git --git-dir="C:\Users\duran\OneDrive\Project\my-blog\.workbuddy\backup\duranchen-pages-mirror.git" `
    push --force https://github.com/duranchen/duranchen.github.io.git `
    "80b4eed786b53b51c6a4c8ed97b5edcf19bd30bd:refs/heads/main"
```

用完整 SHA 而不是分支名，是故意的：**推哪个版本一目了然，不依赖任何本地分支恰好停在哪里。** 该 commit 已校验完整（220 个文件、`CNAME` 内容为 `blog.duranc.cc`、`fsck --connectivity-only` 无报错），命令语法也已用一个临时裸仓库实测通过。

推送后到 GitHub 的 Actions 页确认 `pages build and deployment` 变为 `success`（这份 commit 在 2026-09-16 曾成功构建过）。

最后提醒：`hexo deploy` 要推 GitHub，**本机智能体没有凭据、跑不了**，得在你自己的终端里执行（会弹 GCM 授权）。

## 从零恢复（换机器 / 清空 node_modules 后）

```bash
git clone https://github.com/duranchen/my-hexo.git && cd my-hexo

# 1. 依赖（node_modules 不进版本库）
npm install

# 2. 关键补丁（漏了这步，构建会静默产出 0 字节文件）
git apply patches/hexo-3.2.2-node-autodestroy.patch

# 3. 验证
node node_modules/hexo/bin/hexo clean && node node_modules/hexo/bin/hexo generate
```

主题**不用单独获取**——`themes/next` 已随仓库提供（见上文坑 2）。

验收标准：日志出现 `INFO  193 files generated`、无 `No layout` 警告、`public/` 无 0 字节文件，归档页显示「共计 65 篇」。

## 主题配置在哪改

**站点头像、方案、评论、统计这些改 `themes/next/_config.yml`，不要改根目录的 `_config.yml`。** NexT 读的是 `theme.*`，写在站点配置里的同名键从来没生效过（历史上有过这种重复，已清理）。

当前对齐 2016 年线上站点的配置：

| 配置项 | 值 |
|---|---|
| `scheme` | Pisces |
| `since` | 2016 |
| `avatar` | `/images/avatar.jpg` |
| `sidebar.position` | right |
| `disqus_shortname` | duranchen |
| `google_analytics` | `G-Q2YWF1LSSV`（GA4） |

> **Google Analytics 已从 Universal Analytics 换成 GA4。** 原先的 `UA-80234027-1` 属性早已停收数据，
> 而 NexT 5.0.1 自带的统计片段用的是退役的 `analytics.js` + `ga('create', ...)`，**根本不认 GA4 的 `G-` ID**——
> 所以不是把 ID 换个值就行，得把整段换成 gtag.js。
> 改动在 `themes/next/layout/_scripts/third-party/analytics/google-analytics.swig`
> （gtag.js 同时兼容 `G-` 与 `UA-` ID，故无需分支判断）。
>
> 两个容易踩的点：
> 1. **不要加 `cookie_domain`**。上游 NexT 7 的写法会写死 `config.url` 的域名，而这里 `url` 是
>    `duranchen.github.io`、实际入口却是 `blog.duranc.cc`——写死会让 `_ga` cookie 落到错误域上，访问量静默归零。
>    留空由 GA 自取当前主机名才是对的。
> 2. **大陆访客基本加载不到 `googletagmanager.com`**，GA 数据会明显低于真实访问量。这是 GA 的先天限制，
>    UA 时代同样如此。若在意国内数据，可另挂一个不蒜子计数（主题自带 `busuanzi-counter.swig`）。

## 仓库状态

`node_modules/`、`public/`、`db.json`、`.deploy_git/` 都已移出版本控制，仓库从 7951 个追踪文件瘦到 **411 个**（主题 322 + 文章与配图 80 + 配置与补丁 9）。

## 待办

- [ ] **线上 `main` 需要撤销回 `80b4eed`**（事故善后，命令见上文「备份与一键撤销」）——线上站点目前仍在正常服务，但没有凭据，这一步只能由你执行
- [ ] 决定是否真正发布本次构建产物（`hexo deploy`）——发布即接受「部署会删掉什么」那一节列出的 45 个线上文件消失
- [ ] 35 篇没写 `categories`、51 篇没写 `tags`，分类页与标签页偏少（补齐不影响 URL，只是分类页归属问题）
- [ ] 是否把线上的模板文 `hello-world` 也收进来——收了 URL 100% 对齐，不收则少一篇 Hexo 样板文
- [ ] 若日后重建这些文章，`.markdown` 里没有 `<!--more-->` 标记了——它不体现在渲染产物里，无法从线上还原；首页摘要会变成整篇或按主题默认截断
- [ ] `2016-04-17-存储过程.markdown` 与 `2016-04-17-事务.markdown` 内容重复 —— 经核查**2016 年发布时状态即如此**，原始正文从未存在，需重新撰写
- [ ] 空文与短文待补写：**2 篇全空**（`Deployment-Capistrano`、`2016-04-16-获取数据库信息`）+ **15 篇不足 150 字**

### 已办（2026-09-17）

- [x] **修掉 `hexo deploy` 会把本仓库源码推上线上站点的致命缺陷**：新增 `scripts/deploy-guard.js`（挂在 `deployBefore`，删除无 `.git` 的 `.deploy_git`、自行 `git init` 并确保提交身份、写入 `.nojekyll`）。已用本地裸仓库做因果实验验证：停用防护时源码被推上去（411 个文件、含 `source/_posts`），启用后推的是站点（194 个文件、含 `.nojekyll`、零源码泄漏）
- [x] **把 `main` 分支的上游从「页面仓库地址」改回 `origin`**（那次失败部署的副作用，`git push` 会因此推到页面仓库）
- [x] 备份线上仓库：`duranchen-pages-20260917.tar.gz`（含全部 14 次提交）+ `duranchen-pages-mirror.git`（裸镜像，供撤销用）
- [x] **修好部署链路**：`deploy` 段显式加 `branch: main`（不写会默认推 `master`，线上从 `main` 发布 → 命令成功但站点不变）；补 `source/CNAME`（否则 `--force` 会删掉线上 CNAME，`blog.duranc.cc` 失效）；主题菜单补回「分类」（线上侧栏有，此前漏了）
- [x] **GA 换成 GA4**（`G-Q2YWF1LSSV`）：把退役的 `analytics.js` 片段整体重写为 gtag.js，113 个页面全部改到、旧的 UA 代码归零
- [x] **7 个本地提交已 push 到 `origin/main`**（HEAD = `1523fc1`；远端 410 个文件，与本地工作树 `git diff HEAD origin/main` 为空）
- [x] **站点名/副标题统一为线上的「十八般武艺 / 学习思考成长」**（改 `_config.yml`；构建后与线上首页逐字比对通过）
- [x] 8 篇旧文章的目录搬到与线上一致（`thinking/` → `growth/thinking/`、`nce/` → `english/nce/`）→ 两边共有的 **64 篇 URL 已逐字一致**
- [x] 核实「6 处日期与线上不符」是**误判**：实际是 **7 篇文件名日期与 front-matter `date` 打架**，URL 本身与线上完全一致，**因此不动文件名**（改名反而会断链）
- [x] **GA 换成 GA4**（`G-Q2YWF1LSSV`）：把退役的 `analytics.js` 片段整体重写为 gtag.js，113 个页面全部改到、旧的 UA 代码归零
- [x] **7 个本地提交已 push 到 `origin/main`**（HEAD = `1523fc1`；远端 410 个文件，与本地工作树 `git diff HEAD origin/main` 为空）
- [x] **站点名/副标题统一为线上的「十八般武艺 / 学习思考成长」**（改 `_config.yml`；构建后与线上首页逐字比对通过）
- [x] 8 篇旧文章的目录搬到与线上一致（`thinking/` → `growth/thinking/`、`nce/` → `english/nce/`）→ 两边共有的 **64 篇 URL 已逐字一致**
- [x] 核实「6 处日期与线上不符」是**误判**：实际是 **7 篇文件名日期与 front-matter `date` 打架**，URL 本身与线上完全一致，**因此不动文件名**（改名反而会断链）
