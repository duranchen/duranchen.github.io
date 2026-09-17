# 德智体美劳

> 小时候经常听，从来没弄懂过。

一个 2016 年的个人学习笔记博客，内容跨编程、英语、理财、成长、健身、新概念等方向。
技术栈是 Hexo 3.2.2 + NexT 5.0.1（Pisces 方案），构建成静态站点后发布到 GitHub Pages。

- 本仓库：https://github.com/duranchen/my-hexo.git（分支 `main`）
- 部署仓库：https://github.com/duranchen/duranchen.github.io.git
- 线上域名：https://blog.duranc.cc —— `duranchen.github.io` 会跳转到这个自定义域名

> ⚠️ **线上站点的名称与本仓库配置不同，且历史上本仓库落后于线上。**
> 详见下文「线上站点与本仓库的差异」——线上站叫「十八般武艺」，本仓库 `_config.yml` 里是「德智体美劳」。
> 2026-09-17 已把线上多出的 29 篇文章抓回本仓库，两边内容量一致（各 65 篇），并把 8 篇旧文章的目录搬到与线上相同的位置
> ——**两边共有的 64 篇，URL 已逐字一致**（核对方式见下文）。

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

# 构建（当前产物：192 个文件 / 约 7 s）
node node_modules/hexo/bin/hexo generate

# 本地预览 → http://localhost:4000
node node_modules/hexo/bin/hexo server

# 部署到 GitHub Pages —— ⚠️ 跑之前先读「线上站点与本仓库的差异」一节
node node_modules/hexo/bin/hexo deploy
```

> **不要随手 `deploy`。** 部署目标是 `duranchen.github.io` 仓库，而线上那套内容比本仓库**更新**（65 篇 vs 36 篇）。
> `hexo deploy` 是强推 `public/`，会把线上的新文章连带自定义域名的配置一起冲掉，可能导致 `blog.duranc.cc` 失效。
> 想上线前先确认：你到底是想「把本站发布为新站」，还是「别碰线上」。

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

### 2. 主题不在 npm 上，要手动 clone

NexT 5.x 用 `.swig` 模板，需要 `hexo-renderer-swig`（运行时还依赖 `swig-extras`）。这两个包已写进 `package.json`，正常 `npm install` 能拉回。

但**主题是从 GitHub clone 的，不在 npm 上**，重装时要手动补：

```bash
git clone --depth 1 --branch v5.0.1 https://github.com/iissnan/hexo-theme-next.git themes/next
```

> 如果 clone 后误留了 `themes/next/.git`，记得删掉，否则主题会被当成子模块、内容根本不进主仓库。

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
| 站点名 | 德智体美劳（`_config.yml`） | **十八般武艺** |
| 副标题 | 小时候经常听，从来没弄懂过。 | **学习思考成长** |
| 篇数 | 65 | 65 |
| 域名 | — | `blog.duranc.cc`（`duranchen.github.io` 301 至此） |
| 构建时的 `url` | `https://duranchen.github.io` | `http://duranchen.github.io`（页面 canonical 可见） |

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

1. **`hexo deploy` 有破坏性**：它强推 `public/` 到 `duranchen.github.io` 仓库，会覆盖线上那 65 篇的内容与自定义域名配置。要动线上，先在 GitHub 上确认那个仓库当前状态并做好分支备份。
2. **站点名与副标题不同**：本仓库配置里是「德智体美劳 / 小时候经常听，从来没弄懂过。」，线上是「十八般武艺 / 学习思考成长」。这是两条线各自的历史状态，要不要统一由你定。
3. **`url` 目前填 `https://duranchen.github.io`**：与线上构建时用的值一致（线上页面 canonical 也指向该域名，`blog.duranc.cc` 只是它的自定义域名），所以这个值无需改动。仅 scheme 由 http 变 https，不影响站内链接。

本仓库的价值在于它是**可构建的源文件快照**；线上站点是**成品**。两者不要混为一谈，也不要让一次 `deploy` 把它们的关系搞乱。

## 从零恢复（换机器 / 清空 node_modules 后）

```bash
git clone https://github.com/duranchen/my-hexo.git && cd my-hexo

# 1. 依赖
npm install

# 2. 主题（不在 npm 上）
git clone --depth 1 --branch v5.0.1 https://github.com/iissnan/hexo-theme-next.git themes/next
rm -rf themes/next/.git          # 关键：别留嵌套仓库

# 3. 关键补丁（漏了这步，构建会静默产出 0 字节文件）
git apply patches/hexo-3.2.2-node-autodestroy.patch

# 4. 验证
node node_modules/hexo/bin/hexo clean && node node_modules/hexo/bin/hexo generate
```

验收标准：日志出现 `INFO  192 files generated`、无 `No layout` 警告、`public/` 无 0 字节文件，归档页显示「共计 65 篇」。

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
| `google_analytics` | UA-80234027-1 |

> `google_analytics` 用的还是 Universal Analytics 的 `UA-` 属性，那套服务早已停止收数。如需继续统计，要换成 GA4 的 `G-` 衡量 ID。

## 仓库状态

`node_modules/`、`public/`、`db.json`、`.deploy_git/` 都已移出版本控制，仓库从 7951 个追踪文件瘦到 **410 个**（主题 322 + 文章与配图 79 + 配置与补丁 9）。

## 待办

- [ ] **本地提交尚未 push 到 origin/main**：用 `git log origin/main..HEAD` 查看待推送提交，确认无误后执行 `git push`
- [ ] **站点名/副标题是否统一为线上的「十八般武艺 / 学习思考成长」**（本仓库现为「德智体美劳 / 小时候经常听，从来没弄懂过。」）
- [ ] GA 换成 GA4（现为早已停服的 `UA-80234027-1`）
- [ ] 35 篇没写 `categories`、51 篇没写 `tags`，分类页与标签页偏少（补齐不影响 URL，只是分类页归属问题）
- [ ] 是否把线上的模板文 `hello-world` 也收进来——收了 URL 100% 对齐，不收则少一篇 Hexo 样板文
- [ ] 若日后重建这些文章，`.markdown` 里没有 `<!--more-->` 标记了——它不体现在渲染产物里，无法从线上还原；首页摘要会变成整篇或按主题默认截断
- [ ] `2016-04-17-存储过程.markdown` 与 `2016-04-17-事务.markdown` 内容重复 —— 经核查**2016 年发布时状态即如此**，原始正文从未存在，需重新撰写
- [ ] 空文与短文待补写：**2 篇全空**（`Deployment-Capistrano`、`2016-04-16-获取数据库信息`）+ **15 篇不足 150 字**

### 已办（2026-09-17）

- [x] 8 篇旧文章的目录搬到与线上一致（`thinking/` → `growth/thinking/`、`nce/` → `english/nce/`）→ 两边共有的 **64 篇 URL 已逐字一致**
- [x] 核实「6 处日期与线上不符」是**误判**：实际是 **7 篇文件名日期与 front-matter `date` 打架**，URL 本身与线上完全一致，**因此不动文件名**（改名反而会断链）
