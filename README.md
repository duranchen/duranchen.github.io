# 德智体美劳

> 小时候经常听，从来没弄懂过。

一个 2016 年的个人学习笔记博客，内容跨编程、英语、理财、思考、新概念五个方向。
技术栈是 Hexo 3.2.2 + NexT 5.0.1（Pisces 方案），构建成静态站点后发布到 GitHub Pages。

- 本仓库：https://github.com/duranchen/my-hexo.git（分支 `main`）
- 部署仓库：https://github.com/duranchen/duranchen.github.io.git
- 线上域名：https://blog.duranc.cc —— `duranchen.github.io` 会跳转到这个自定义域名

> ⚠️ **线上站点跑的不是本仓库的版本。** 详见下文「线上站点与本仓库的差异」。那个站叫「十八般武艺」、65 篇、内容到 2016-09；
> 本仓库是更早的快照「德智体美劳」、36 篇、只到 2016-07。

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

# 构建（当前产物：135 个文件 / 约 4.6 s）
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
│   ├── _posts/            文章正文，按分类分子目录
│   │   ├── programming/   16 篇
│   │   ├── english/        7 篇
│   │   ├── finance/        5 篇
│   │   ├── thinking/       5 篇
│   │   └── nce/            3 篇
│   ├── images/            配图（2016/ 存正文图，根目录是头像 avatar.jpg）
│   └── categories/        分类页入口
├── themes/next/           NexT 5.0.1 主题
└── public/                构建产物，已 gitignore（不提交）
```

## 内容说明

36 篇文章，写作时间集中在 2016 年 4–7 月。front-matter 里 `permalink` 用的是**日期**，所以**改文章的 date 会改变线上 URL**，动手前先想清楚。

分类只有 4 篇文章显式声明（`Method` 3 篇 / `Concept` 1 篇），其余 32 篇未分类，因此分类页比较空。标签全部为空。

正文配图原本外链简书图床，现已全部下载到 `source/images/2016/` 并改为相对路径，站点离线自洽。两点注意：

- 图床返回的实际是 **WebP** 格式（不是 PNG/JPEG），文件头是 `RIFF....WEBP`，按 PNG/JPEG 校验会误报
- 其中一张增长曲线图是本地重绘的 SVG（原 Wikimedia 源在当前网络不可达），见 `source/images/2016/exponential-vs-linear-vs-power.svg`

另有 6 篇正文不足 150 字的"空壳文"（动词时态、从网页查询数据库、获取数据库信息、从文本导入数据到数据库、抽象能力、策略与坚持）——是原作者留下的标题，内容未写完，属正常状态而非损坏。

## 线上站点与本仓库的差异

这一点容易误判，单看仓库是看不出来的，所以单独说明。

| | 本仓库（源文件） | 线上站点 |
|---|---|---|
| 站点名 | 德智体美劳 | **十八般武艺** |
| 篇数 | 36 | **65** |
| 时间跨度 | 2016-04 ~ 2016-07 | 至 **2016-09**（起点未逐一核实） |
| 分类 | `Method` / `Concept` | `growth` / `programming` / `thinking`（含 `growth/thinking` 嵌套） |
| 域名 | — | `blog.duranc.cc`（`duranchen.github.io` 301 至此） |

也就是说：**线上是这条博客线更晚的状态，本仓库停在 2016-07。** 线上多出来的文章（如《Provisioning》《Deployment Capistrano》《如何读一本书》《对半途而废的思考》《李笑来写作课第一课笔记》等）在这个仓库里没有源文件。

由此带来两个后果：

1. **`hexo deploy` 有破坏性**：它强推 `public/` 到 `duranchen.github.io` 仓库，会覆盖线上那 65 篇的内容与自定义域名配置。要动线上，先在 GitHub 上确认那个仓库当前状态并做好分支备份。
2. **`_config.yml` 的 `url` 需要你定夺**：目前填 `https://duranchen.github.io`（原部署目标）。若本意是与线上保持一致，应改为 `https://blog.duranc.cc`，否则生成的 canonical / RSS 链接都指向旧域名。

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

验收标准：日志出现 `INFO  135 files generated`、无 `No layout` 警告、`public/` 无 0 字节文件。

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

`node_modules/`、`public/`、`db.json`、`.deploy_git/` 都已移出版本控制，仓库从 7951 个追踪文件瘦到 **381 个**（主题 322 + 文章与配图 50 + 配置与补丁 9）。

## 待办

- [ ] **本地提交尚未 push 到 origin/main**：用 `git log origin/main..HEAD` 查看待推送提交，确认无误后执行 `git push`
- [ ] **`url` 到底用哪个域名**：`https://duranchen.github.io` 还是 `https://blog.duranc.cc`（见「线上站点与本仓库的差异」）
- [ ] 线上 65 篇 vs 本仓库 36 篇 —— 是否把线上的后续文章抓回来补进本仓库
- [ ] GA 换成 GA4
- [ ] 32 篇文章缺分类，分类页偏空
- [ ] 6 篇空壳文待补写
- [ ] `2016-04-17-存储过程.markdown` 与 `2016-04-17-事务.markdown` 内容重复 —— 经核查**2016 年发布时状态即如此**，原始正文从未存在，需重新撰写
- [ ] 6 处 front-matter 日期与文件名不一致（涉及线上 URL，改动需谨慎）
