# 十八般武艺

> 学习思考成长

一个 2016 年的个人学习笔记博客，内容跨编程、英语、理财、成长、健身、新概念等方向。
技术栈是 Hexo **8.1.2** + NexT 5.0.1（Pisces 方案），构建成静态站点后发布到 GitHub Pages。
（2026-09-17 从 Hexo 3.2.2 升级，NexT 5 主题原封未动，产物经逐字节 + 像素级比对与升级前等价，见「Hexo 8 升级记录」。）

- 本仓库：https://github.com/duranchen/my-hexo.git（分支 `main`）——**2026-09-17 起也是发布仓库**，push 即由 GitHub Actions 构建发布
- 旧部署仓库：https://github.com/duranchen/duranchen.github.io.git（`hexo deploy` 时代的目标，域名迁走后退役）
- 本地目录：`OneDrive\Project\my-blog`（2026-09-17 由 `my-hexo` 改名而来，**只改了本地文件夹名，远端仓库名仍是 `my-hexo`**）
- 线上域名：https://blog.duranc.cc —— Cloudflare 上的 CNAME 指向 `duranchen.github.io`，GitHub 按主机名路由到配置了该自定义域名的仓库

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
| Node.js | ≥ 20.19.0（Hexo 8 的硬性要求；本机 22.22.2 已验证） | |
| 依赖包 | 见 `package.json` | `node_modules/` 未提交到 git，换机器或清空后需 `npm install` 重装 |
| 主题 | NexT **5.0.1** | 位于 `themes/next/`，已提交；注意其自带 `package.json` 里 version 仍写 5.0.0，上游 tag 未同步，属正常 |

## 常用命令

Hexo 8 的 npm 安装已生成标准 shim（Windows 有 `node_modules/.bin/hexo.cmd`，Linux 有无扩展名 shim），
所以 `npm run build`、`npx hexo <cmd>` 都可用；下面保留 `node node_modules/hexo/bin/hexo` 写法，两边通用：

```bash
# 清空 public/（会重置构建缓存 db.json）
node node_modules/hexo/bin/hexo clean

# 构建（当前产物：196 个文件 / 约 6 s）
node node_modules/hexo/bin/hexo generate

# 本地预览 → http://localhost:4000
node node_modules/hexo/bin/hexo server

# 发布 = git push 到 main，GitHub Actions 自动构建并发布（见「部署」一节）
# ⚠️ `hexo deploy` 已退役：deploy 配置与 hexo-deployer-git 均已移除，执行会直接报错——这是有意的
```

Hexo 8 的构建日志干净（只有 `INFO  Validating config` 和 `INFO  196 files generated`，Hexo 3 时代的 14 条 WARN 已随升级消失）。判断构建是否正常，看这两个指标就够：

- 出现 `INFO  xxx files generated`，且**没有** `WARN  No layout`（出现即主题没装好）
- `public/` 里**没有 0 字节文件**（0 字节静默空壳是 Hexo 3.2.2 + 新版 Node 才有的坑，Hexo 8 不存在；回滚 Hexo 3 时需重新打补丁，见下）

---

## ⚠️ 三个必须知道的坑

### 1. （仅回滚 Hexo 3 时）0 字节补丁必须重新应用

Hexo 8 **没有这个问题**，本节只在把 Hexo 回滚到 3.2.2 时才相关。

Hexo 3.2.2 把 `CacheStream.destroy` 重写成"清空缓存"（本想手动回收内存），而 Node 14 起 stream 的 `autoDestroy` 默认为 `true` —— 流一结束 Node 就自动调 `destroy()`，把刚写好的内容清空。结果是**每个文件都生成 0 字节，Hexo 却退出码 0、不报任何错**（连 CSS、JS、图片都是空文件）。2016 年的 Node 没这个行为，所以当年能跑。

补丁已固化为 `patches/hexo-3.2.2-node-autodestroy.patch`（给 `node_modules/hexo/lib/plugins/console/generate.js` 加 `{ autoDestroy: false }`）：

```bash
git apply patches/hexo-3.2.2-node-autodestroy.patch
```

**回滚 Hexo 3 后只要动过 `node_modules`，第一件事就是重新应用它，否则整站静默变空壳。**

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

## Hexo 8 升级记录（2026-09-17）

**Hexo 3.2.2 → 8.1.2，NexT 5.0.1 主题原封不动。** 升级在独立副本里先做完整验证（产物 193/193 逐字节比对 + 无头 Chrome 截图像素级比对），确认无损后才落到本仓库。

**升级内容**：
- `package.json` 全量升到 Hexo 8.1.2 生态（hexo-server 3 / deployer-git 4 / generator-* 2.x / renderer-marked 7 / renderer-stylus 3），新增 `package-lock.json`
- **保留** `hexo-renderer-swig 1.1.0` + `swig-extras 0.0.1`——NexT 5 的 `.swig` 模板全靠它渲染
- `themes/next/_config.yml` 补写 `author: 陈群` / `description: ever-growing`——Hexo 3 会把站点配置继承给主题，Hexo 8 不再这样做，不补则侧栏这两行渲染为空
- `themes/next/layout/_partials/pagination.swig` 给 `paginator()` 加 `escape: false`——Hexo 8 默认转义 HTML，不加会把上一页/下一页的 `<i class="fa fa-angle-…">` 图标渲染成字面文本

**升级后与 Hexo 3 产物的差异清单**（全部已核实、均可接受）：
1. 作者链接前的小圆点颜色变了——这是 NexT 故意的彩蛋，`random-color()` 每次编译随机，本来每次构建都会变
2. 代码块：highlight.js 9 → 11，个别 token 的归类变了（同一天空色板：部分字符从橙色变成 aqua/红色，字符串/注释颜色不变），行距因 `<span>+<br>` 行结构略紧几像素
3. 同日发布的文章在列表/归档里的先后顺序可能与其它目录的构建不同——Hexo 对同 date 文章的排序依赖文件枚举顺序；本仓库目录内 Hexo 8 与 Hexo 3 的排序已验证一致，URL 不受任何影响（URL 由目录名 + front-matter date 决定）

**回滚到 Hexo 3**：`package.json` 旧版在提交 `e55f533`（升级前最后一个提交），checkout 后 `npm install` 并按坑 1 打补丁即可；Hexo 3 的 node_modules 另有 tar 备份在 `.workbuddy/backup/node_modules-hexo3-20260917.tar.gz`。

---

## 目录结构

```
├── _config.yml            站点配置（站点信息、URL、permalink；deploy 段已移除——发布走 CI）
├── .github/workflows/     GitHub Actions 发布工作流（pages.yml，见「部署」一节）
├── package.json           依赖声明（scripts.build = hexo clean && hexo generate）
├── .gitignore             Hexo 规则：忽略 node_modules / public / db.json / .deploy_git
├── patches/               Hexo 3 的 0 字节补丁（仅在回滚 Hexo 3 时使用）
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

1. **部署方式已切换**（2026-09-17）：`hexo deploy` 路径退役，push 到 `main` 即由 GitHub Actions 构建发布，**详见下面「部署」一节**；旧路径的事故分析保留在「历史档案」。
2. **站点名与副标题**（2026-09-17）：白天曾统一为「十八般武艺 / 学习思考成长」，当晚由作者本人改为「角落 / 记录一下生活和思考」（提交 `91771ea`），并发布新文章《终于拥有自己的域名》（提交 `b28eced`）。
3. **`url` 目前填 `https://duranchen.github.io`**：与线上构建时用的值一致（线上页面 canonical 也指向该域名，`blog.duranc.cc` 只是它的自定义域名），所以这个值无需改动。仅 scheme 由 http 变 https，不影响站内链接。

本仓库的价值在于它是**可构建的源文件快照**；线上站点是**成品**。现在两者通过 CI 直接打通——push 即发布，不需要、也不应该再跑本地 deploy。

## 部署（GitHub Actions，2026-09-17 起生效）

> **发布方式已按 [Hexo 官方文档](https://hexo.io/zh-cn/docs/github-pages) 从 `hexo deploy` 切换为 GitHub Actions。**
> 源码 push 到 `main` → Actions 自动 `npm ci` + `npm run build` → 把 `public/` 作为 artifact 发布到**本仓库**的 GitHub Pages。
> 旧的 `hexo deploy` 路径已退役：`_config.yml` 的 `deploy:` 段已删除、`hexo-deployer-git` 已移出依赖，**`hexo deploy` 现在会报错，这是有意的**——它曾造成源码误推事故（完整分析保留在下方历史档案）。

### 日常工作流

写完文章后只需：

```bash
git add ... && git commit -m "new post"
git push origin main          # 推上去 CI 自动构建发布，约 1~2 分钟生效
```

到仓库 **Actions** 页确认 `Pages` 工作流绿了即发布成功。本地不需要构建、不需要任何凭据。

### 工作流与官方示例的差异（3 处，均有意为之）

| 官方示例 | 本仓库 | 原因 |
|---|---|---|
| `node-version: "20"` | `"22"` | 本机验证过的版本；Hexo 8 要求 ≥ 20.19.0 |
| `npm install` | `npm ci` | `package-lock.json` 已入库，锁定依赖版本（swig 渲染器对版本敏感，见坑 2） |
| checkout 带 `submodules: recursive` | 不带 | `themes/next` 是普通文件提交，不是 submodule |

构建命令走 `package.json` 的 `"build": "hexo clean && hexo generate"`，与官方文档一致。

### 首次启用步骤（只需做一次，顺序重要）

1. **先**到 my-hexo 仓库 **Settings → Pages → Build and deployment → Source**，选 **GitHub Actions** 并保存。
   （不做这步，第一次工作流的 deploy 阶段会报 `Pages not enabled`。）
2. push 本仓库（本文件所在的提交即可）→ Actions 自动跑第一次构建，发布到 `https://duranchen.github.io/my-hexo/`。
   该子路径下**样式是散的**——站点资源是根绝对路径 `/css/...`，这是预期现象，不是故障。
3. **域名切换**（存在几分钟 404 窗口，挑个空闲时间做）：
   - duranchen.github.io 仓库 → Settings → Pages → 删除自定义域名 `blog.duranc.cc`
   - my-hexo 仓库 → Settings → Pages → Custom domain 填 `blog.duranc.cc` → Save
   - 等页面提示 DNS 检查通过后，勾选 **Enforce HTTPS**
   - 同一个自定义域名只能被一个仓库占用，所以必须先删后加；`source/CNAME`（内容 `blog.duranc.cc`）会随构建进入产物，保持绑定不丢
4. 打开 https://blog.duranc.cc 验证。**DNS 不用动**：Cloudflare 的 `blog` CNAME 仍指向 `duranchen.github.io`，GitHub 按主机名把流量路由到配置了该域名的仓库。

### 与旧部署路径的关键差异

- `public/` 不再进任何 git 仓库——发布的是构建 artifact，**不存在 `--force` 强推、没有镜像分支**，误推源码的事故路径从机制上消失
- Actions 发布**不跑 Jekyll**，`.nojekyll` 不再需要；`scripts/deploy-guard.js` 保留作防御（其写 `.nojekyll` 的逻辑失效但无害）
- 发布身份是仓库自带的 `GITHUB_TOKEN`（工作流内 `permissions` 已最小化），**无需 PAT、无需本机凭据**
- duranchen.github.io 仓库退役：域名迁走后它仍会在 `duranchen.github.io` 这个 URL 提供旧内容，想清空或归档随时可做（完整历史备份在 `.workbuddy/backup/`，见下文）

### 如需临时恢复本地 `hexo deploy`

从提交 `91771ea`（本次切换前最后一个提交）取回 `_config.yml` 的 `deploy:` 段与 `package.json` 的 `hexo-deployer-git` 依赖即可；`scripts/deploy-guard.js` 一直在，恢复后防护立即生效。

---

## 历史档案：`hexo deploy` 与 2026-09-17 事故

> 以下内容描述的是**已退役**的部署路径，留作档案。理解它为什么危险，才能理解为什么换成 CI。

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

### 旧路径的部署前置检查（已随路径退役）

当年的检查清单——构建干净（无 `No layout`、无 0 字节文件）、`public/CNAME` 在产物里、`deploy` 段显式写 `branch: main`、首次部署前备份线上仓库——已由 CI 流程自然覆盖：构建在 Actions 里标准化执行，CNAME 由 `source/CNAME` 随产物携带，线上不再被强推。下面这行备份命令仍可用于查看退役中的仓库：

```bash
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

（2026-09-17 起 `hexo deploy` 已退役——本机有没有凭据都不再重要，发布走 CI。）

## 从零恢复（换机器 / 清空 node_modules 后）

```bash
git clone https://github.com/duranchen/my-hexo.git && cd my-hexo

# 1. 依赖（node_modules 不进版本库；Hexo 8 要求 Node ≥ 20.19.0）
npm install

# 2. 验证（与 CI 同款构建命令）
npm run build        # = hexo clean && hexo generate
```

主题**不用单独获取**——`themes/next` 已随仓库提供（见上文坑 2）。发布也不用配置任何东西——push 到 `main` 即由 GitHub Actions 构建（见「部署」一节）。

验收标准：日志出现 `INFO  196 files generated`（文章数增长会变）、无 `No layout` 警告、`public/` 无 0 字节文件、产物含 `CNAME`。

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

- [ ] **完成 CI 发布的首次启用 + 域名切换**（步骤见上文「部署（GitHub Actions）→ 首次启用步骤」——Settings 里把 Pages Source 切到 GitHub Actions、push、再把 `blog.duranc.cc` 从 duranchen.github.io 挪到本仓库）
- [ ] duranchen.github.io 仓库退役善后：可选把其 `main` 撤销回 `80b4eed`（命令见「历史档案 → 备份与一键撤销」）或整体归档；它不再承载 blog.duranc.cc
- [ ] 35 篇没写 `categories`、51 篇没写 `tags`，分类页与标签页偏少（补齐不影响 URL，只是分类页归属问题）
- [ ] 是否把线上的模板文 `hello-world` 也收进来——收了 URL 100% 对齐，不收则少一篇 Hexo 样板文
- [ ] 若日后重建这些文章，`.markdown` 里没有 `<!--more-->` 标记了——它不体现在渲染产物里，无法从线上还原；首页摘要会变成整篇或按主题默认截断
- [ ] `2016-04-17-存储过程.markdown` 与 `2016-04-17-事务.markdown` 内容重复 —— 经核查**2016 年发布时状态即如此**，原始正文从未存在，需重新撰写
- [ ] 空文与短文待补写：**2 篇全空**（`Deployment-Capistrano`、`2016-04-16-获取数据库信息`）+ **15 篇不足 150 字**

### 已办（2026-09-17）

- [x] **升级 Hexo 3.2.2 → 8.1.2**（NexT 5 主题原封未动，产物双重比对等价；详见「Hexo 8 升级记录」）
- [x] **部署方式按官方文档切换为 GitHub Actions**：新增 `.github/workflows/pages.yml`，移除 `_config.yml` 的 `deploy:` 段与 `hexo-deployer-git` 依赖（详见「部署」一节）
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
