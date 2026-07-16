# VV影视 (VVideo)

![VV影视 Banner](public/icon.png)

> 一个基于 Next.js 16 构建的现代化免费影视聚合搜索与播放平台。采用独特的 "Liquid Glass" 设计语言，提供流畅的视觉体验和强大的多源影视搜索功能。项目原名 KVideo，代码库地址保持不变。

**🌐 在线体验：[https://vv19.com/](https://vv19.com/)**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

## 📖 项目简介

**KVideo** 是一个高性能、现代化的视频聚合与播放应用，专注于提供极致的用户体验和视觉设计。本项目利用 Next.js 16 的最新特性，结合 React 19 和 Tailwind CSS v4，打造了一个既美观又强大的视频浏览平台。

### 核心设计理念：Liquid Glass（液态玻璃）

项目的视觉设计基于 **"Liquid Glass"** 设计系统，这是一套融合了以下特性的现代化 UI 设计语言：

- **玻璃拟态效果**：通过 `backdrop-filter` 实现的磨砂半透明效果，让 UI 元素如同真实的玻璃材质
- **通用柔和度**：统一使用 `rounded-2xl` 和 `rounded-full` 两种圆角半径，创造和谐的视觉体验
- **光影交互**：悬停和聚焦状态下的内发光效果，模拟光线被"捕获"的物理现象
- **流畅动画**：基于物理的 `cubic-bezier` 曲线，实现自然的加速和减速过渡
- **深度层级**：清晰的 z-axis 层次结构，增强空间感和交互反馈

## ✨ 核心功能

### 🎥 智能视频播放

- **HLS 流媒体支持**：原生支持 HLS (.m3u8) 格式，提供流畅的视频播放体验
- **智能缓存机制**：Service Worker 驱动的智能缓存系统，自动预加载和缓存视频片段
- **后台下载**：利用观看历史，在后台自动下载历史视频，确保离线也能观看
- **播放控制**：完整的播放控制功能，包括进度条、音量控制、播放速度调节、全屏模式等
- **移动端优化**：专门为移动设备优化的播放器界面和手势控制

### 🔍 多源并行搜索

- **聚合搜索引擎**：同时在多个视频源中并行搜索，大幅提升搜索速度
- **自定义视频源**：支持添加、编辑和管理自定义视频源
- **智能解析**：统一的解析器系统，自动处理不同源的数据格式
- **搜索历史**：自动保存搜索历史，支持快速重新搜索
- **结果排序**：支持按评分、时间、相关性等多种方式排序搜索结果

### 🎬 豆瓣集成

- **电影 & 电视剧分类**：支持在电影和电视剧之间无缝切换，方便查找不同类型的影视资源
- **详细影视信息**：自动获取豆瓣评分、演员阵容、剧情简介等详细信息
- **推荐系统**：基于豆瓣数据的相关推荐
- **专业评价**：展示豆瓣用户评价和专业影评

### 💾 观看历史管理

- **自动记录**：自动记录观看进度和历史
- **断点续播**：从上次观看位置继续播放
- **历史管理**：支持删除单条历史或清空全部历史
- **隐私保护**：所有数据存储在本地，不上传到服务器

### 📱 响应式设计

- **全端适配**：完美支持桌面、平板和移动设备
- **移动优先**：专门的移动端组件和交互设计
- **触摸优化**：针对触摸屏优化的手势和交互

### 🌙 主题系统

- **深色/浅色模式**：支持系统级主题切换
- **动态主题**：基于 CSS Variables 的动态主题系统
- **无缝过渡**：主题切换时的平滑过渡动画

### ⌨️ 无障碍设计

- **键盘导航**：完整的键盘快捷键支持
- **ARIA 标签**：符合 WCAG 2.2 标准的无障碍实现
- **语义化 HTML**：使用语义化标签提升可访问性
- **高对比度**：确保 4.5:1 的文字对比度

### 💎 高级模式

- **独立入口**：在浏览器地址栏直接输入 `/premium` 即可进入独立的高级视频专区
- **内容隔离**：高级内容与普通内容完全物理隔离，互不干扰
- **专属设置**：拥有独立的内容源管理和功能设置

### 🛡️ 广告过滤
- **多模式选择**：支持关闭、关键词过滤、智能启发式过滤(Beta)和激进模式。
- **UI 集成**：在播放器设置菜单中直接切换模式，实时生效。
- **自定义关键词**：支持通过环境变量扩展过滤关键词。
- **高性能**：基于流式处理，对播放加载速度几乎无影响。

## 🔐 隐私保护

本应用注重用户隐私：

- **本地存储**：所有数据存储在本地浏览器中
- **无服务器数据**：不收集或上传任何用户数据
- **自定义源**：用户可自行配置视频源

## 🔒 密码访问控制

KVideo 支持两种密码保护方式：

### 方式一：本地保存密码

在设置页面中启用密码访问，并添加密码：

- **设备独立**：仅在当前浏览器/设备有效
- **可管理**：可随时添加或删除
- **多密码支持**：可设置多个有效密码

### 方式二：环境变量密码（推荐用于部署）

通过 `ACCESS_PASSWORD` 环境变量设置全局密码：

**Docker 部署：**

```bash
docker run -d -p 3000:3000 -e ACCESS_PASSWORD=your_premium_password --name kvideo kuekhaoyang/kvideo:latest
```

**Vercel 部署：**

在 Vercel 项目设置中添加环境变量：
- 变量名：`ACCESS_PASSWORD`
- 变量值：你的密码

**特点：**
- **全局生效**：所有用户都需要此密码才能访问
- **无法在界面删除**：只能通过修改环境变量更改
- **与本地密码兼容**：两种密码都可以解锁应用
- **密码持久化**：支持通过 `PERSIST_PASSWORD` 环境变量控制是否在当前设备上记住密码。

### 方式三：密码持久化设置（ENV）

通过 `PERSIST_PASSWORD` 环境变量，你可以控制用户在输入正确密码后，是否需要在下次打开时重新输入。

| 变量名 | 选项 | 说明 | 默认值 |
|--------|------|------|--------|
| `PERSIST_PASSWORD` | `true` / `false` | 是否在本地浏览器持久化保存解锁状态。设置为 `true` 时，用户只需输入一次密码，后续访问无需再次输入。 | `true` |

> [!NOTE]
> 此功能仅在设置了 `ACCESS_PASSWORD` 时才会生效。如果没有设置环境密码，此选项将被忽略。

## 🎨 站点名称自定义配置

通过环境变量可以自定义站点名称、标题和描述，无需修改源代码。

### 可用环境变量：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_SITE_NAME` | 站点头部名称（中文品牌名） | `VV影视` |
| `NEXT_PUBLIC_SITE_NAME_EN` | 英文/品牌代号，用于结构化数据与部分文案 | `VVideo` |
| `NEXT_PUBLIC_SITE_TITLE` | 浏览器标签页标题（`<title>`） | `VV影视 (VVideo) - 免费在线电影电视剧多源聚合搜索平台` |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | SEO 描述（`meta description`） | 见 `lib/config/site-config.ts` |
| `NEXT_PUBLIC_SITE_TAGLINE` | 导航栏副标题 / 首页一句话简介 | `免费多源影视聚合搜索，海量电影电视剧一搜即得` |
| `NEXT_PUBLIC_SITE_KEYWORDS` | SEO 关键词，逗号分隔 | 见 `lib/config/site-config.ts` |
| `NEXT_PUBLIC_SITE_URL` | 规范站点域名（用于 canonical / sitemap / OG，末尾不要带 `/`） | `https://vv19.com` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console 站点验证码 | 空 |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Yandex Webmaster 站点验证码 | 空 |
| `NEXT_PUBLIC_BAIDU_SITE_VERIFICATION` | 百度站长平台站点验证码 | 空 |
| `INDEXNOW_KEY` | IndexNow 密钥（UUID），用于向 Yandex/Bing 提交新页面即时收录 | 空 |
| `PERSIST_PASSWORD` | 密码持久化 | `true` |

> 部署到自己的域名时，请务必设置 `NEXT_PUBLIC_SITE_URL` 为你自己的域名，否则 sitemap、canonical、OpenGraph 链接会指向默认域名。

### Yandex 站长验证步骤

1. 登录 [Yandex Webmaster](https://webmaster.yandex.com/) 并添加站点 `https://vv19.com`
2. 选择 **Meta 标签验证**，复制验证码（格式为一串十六进制字符串）
3. 在 Cloudflare Pages 环境变量中添加：`NEXT_PUBLIC_YANDEX_VERIFICATION = <验证码>`
4. 重新部署后，在 Yandex Webmaster 点击"验证"

### IndexNow 快速收录（Yandex / Bing / Naver）

[IndexNow](https://www.indexnow.org/) 协议允许在发布新内容后立即通知搜索引擎索引，无需等待爬虫自然发现：

1. 生成一个 UUID 作为密钥（例如 https://www.uuidgenerator.net/）
2. 在 Cloudflare Pages 环境变量中设置：`INDEXNOW_KEY = <你的UUID>`（**注意：不加 `NEXT_PUBLIC_` 前缀**，避免泄漏到客户端 JS）
3. 重新部署后，验证密钥文件可访问：`https://vv19.com/indexnow-key.txt`
4. 每次部署新内容后，在本机运行提交脚本：

```bash
INDEXNOW_KEY=<你的UUID> SITE_URL=https://vv19.com node scripts/submit-indexnow.mjs
```

脚本会自动读取 `sitemap.xml` 并批量提交所有 URL 到 Yandex、Bing 等引擎，大多数情况下几分钟内即可收录。

### 配置示例：

**Vercel 部署：**
在 Vercel 项目设置中添加环境变量：

- 变量名：`NEXT_PUBLIC_SITE_NAME`
- 变量值：`我的视频平台`

**Cloudflare Pages 部署：**
在 Cloudflare Pages 项目设置中添加环境变量：
- 变量名：`NEXT_PUBLIC_SITE_NAME`
- 变量值：`我的视频平台`

**Docker 部署：**
```bash
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_NAME="我的视频平台" \
  -e NEXT_PUBLIC_SITE_TITLE="我的视频 - 聚合播放平台" \
  -e NEXT_PUBLIC_SITE_DESCRIPTION="专属视频聚合播放平台" \
  --name kvideo kuekhaoyang/kvideo:latest
```

**本地开发：**
在项目根目录创建 `.env.local` 文件：
```env
NEXT_PUBLIC_SITE_NAME=我的视频平台
NEXT_PUBLIC_SITE_TITLE=我的视频 - 聚合播放平台
NEXT_PUBLIC_SITE_DESCRIPTION=专属视频聚合播放平台
```

## 📦 自动订阅源配置

可以通过环境变量 `NEXT_PUBLIC_SUBSCRIPTION_SOURCES` 自动配置订阅源，应用启动时会自动加载并设置为自动更新。

**格式：** JSON 数组字符串，包含 `name` 和 `url` 字段。

**示例：**

```bash
NEXT_PUBLIC_SUBSCRIPTION_SOURCES='[{"name":"每日更新源","url":"https://example.com/api.json"},{"name":"备用源","url":"https://backup.com/api.json"}]'
```

**Docker 部署：**

```bash
docker run -d -p 3000:3000 -e NEXT_PUBLIC_SUBSCRIPTION_SOURCES='[{"name":"MySource","url":"..."}]' --name kvideo kuekhaoyang/kvideo:latest
```

**Vercel 部署：**

在 Vercel 项目设置中添加环境变量：
- 变量名：`NEXT_PUBLIC_SUBSCRIPTION_SOURCES`
- 变量值：`[{"name":"...","url":"..."}]`

**Cloudflare Pages 部署：**

在 Cloudflare Pages 项目设置中添加环境变量：
- 变量名：`NEXT_PUBLIC_SUBSCRIPTION_SOURCES`
- 变量值：`[{"name":"...","url":"..."}]`

## 📝 自定义源 JSON 格式

如果你想创建自己的订阅源或批量导入源，可以使用以下 JSON 格式。

**基本结构：**

可以是单个对象数组，也可以是包含 `sources` 或 `list` 字段的对象。

**源对象字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 唯一标识符，建议使用英文 |
| `name` | string | 是 | 显示名称 |
| `baseUrl` | string | 是 | API 地址 (例如: `https://example.com/api.php/provide/vod`) |
| `group` | string | 否 | 分组，可选值: `"normal"` (默认) 或 `"premium"` |
| `enabled` | boolean | 否 | 是否启用，默认为 `true` |
| `priority` | number | 否 | 优先级，数字越小优先级越高，默认为 1 |

**示例 JSON：**

```json
[
  {
    "id": "my_source_1",
    "name": "我的精选源",
    "baseUrl": "https://api.example.com/vod",
    "group": "normal",
    "priority": 1
  },
  {
    "id": "premium_source_1",
    "name": "特殊资源",
    "baseUrl": "https://api.premium-source.com/vod",
    "group": "premium",
    "enabled": true
  }
]
```

### ⚠️ 重要的区别说明：订阅源 vs 视频源

**这是一个常见的误区，请仔细阅读：**

- **视频源 (Source)**：
  - 指向单个 CMS/App API 接口
  - 例如：`https://api.example.com/vod`
  - 这种链接**不能**直接作为"订阅"添加
  - 只能在"自定义源管理"中作为单个源添加

- **订阅源 (Subscription)**：
  - 指向一个 **JSON 文件**（如上面的示例）的 URL
  - 这个 JSON 文件里包含了一个或多个视频源的列表
  - 例如：`https://mysite.com/kvideo-sources.json`
  - 这是一个**配置文件**的链接，不是视频 API 的链接
  - 只有这种返回 JSON 列表的链接才能在"订阅管理"中添加

> **简单来说**：如果你只有一个 m3u8 或 API 接口地址，请去"自定义源"添加。如果你有一个包含多个源的 JSON 文件链接，请去"订阅管理"添加。

## 🛠 技术栈

### 前端核心

| 技术 | 版本 | 用途 |
|------|------|------|
| **[Next.js](https://nextjs.org/)** | 16.0.3 | React 框架，使用 App Router |
| **[React](https://react.dev/)** | 19.2.0 | UI 组件库 |
| **[TypeScript](https://www.typescriptlang.org/)** | 5.x | 类型安全的 JavaScript |
| **[Tailwind CSS](https://tailwindcss.com/)** | 4.x | 实用优先的 CSS 框架 |
| **[Zustand](https://github.com/pmndrs/zustand)** | 5.0.2 | 轻量级状态管理 |

### 开发工具

- **ESLint 9**：代码质量检查
- **PostCSS 8**：CSS 处理器
- **Vercel Analytics**：性能监控和分析

### 架构特点

- **App Router**：Next.js 13+ 的新路由系统，支持服务端组件和流式渲染
- **API Routes**：内置 API 端点，处理豆瓣数据和视频源代理
- **Service Worker**：离线缓存和智能预加载
- **Server Components**：优化首屏加载性能
- **Client Components**：复杂交互和状态管理

## 🚀 快速部署

### 在线体验

访问 **[https://kvideo.vercel.app/](https://kvideo.vercel.app/)** 立即体验，无需安装！

### 部署到自己的服务器





#### 选项 1：Vercel 一键部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KuekHaoYang/KVideo)

1. 点击上方按钮
2. 连接你的 GitHub 账号
3. Vercel 会自动检测 Next.js 项目并部署
4. 几分钟后即可访问你自己的 KVideo 实例

#### 选项 2：Cloudflare Pages 部署 (推荐)

此方法完全免费且速度极快，是部署本项目的最佳选择。

1. **Fork 本仓库**：首先将项目 Fork 到你的 GitHub 账户。

2. **创建项目**：
   - 点击访问 [**Cloudflare Pages - Connect Git**](https://dash.cloudflare.com/?to=/:account/pages/new/provider/github)。
   - 如果未连接 GitHub，请点击 **Connect GitHub**；若已连接，直接选择你刚刚 Fork 的 `KVideo` 项目并点击 **Begin setup**。

3. **配置构建参数**：
   - **Project name**: 默认为 `kvideo` (建议保持不变，后续链接基于此名称)
   - **Framework Preset**: 选择 `Next.js`
   - **Build command**: 输入 `npm run pages:build`
   - **Build output directory**: 输入 `.vercel/output/static`
   - 点击 **Save and Deploy**。

4. **⚠️ 关键步骤：修复运行时环境**
   > *注意：此时部署虽然显示"Success"，但你会发现访问网页会报错。这是因为缺少必要的兼容性配置。请按以下步骤修复：*

   - 进入 **[项目设置页面](https://dash.cloudflare.com/?to=/:account/pages/view/kvideo/settings/production)** (如果你的项目名不是 kvideo，请在控制台手动查找 Settings -> Functions)。
   - 拉到页面底部找到 **Compatibility flags** 部分。
   - 添加标志：`nodejs_compat`

5. **重试部署 (生效配置)**：
   - 回到 **[项目概览页面](https://dash.cloudflare.com/?to=/:account/pages/view/kvideo)**。
   - 在 **Deployments** 列表中，找到最新的那次部署。
   - 点击右侧的三个点 `...` 菜单，选择 **Retry deployment**。
   - 等待新的部署完成后，你的 KVideo 就部署成功了！

#### 选项 3：Docker 部署

**从 Docker Hub 拉取（最简单）：**

```bash
# 拉取最新版本
docker pull kuekhaoyang/kvideo:latest
docker run -d -p 3000:3000 --name kvideo kuekhaoyang/kvideo:latest
```

应用将在 `http://localhost:3000` 启动。

> **✨ 多架构支持**：镜像支持 2 种主流平台架构：
> - `linux/amd64` - Intel/AMD 64位（大多数服务器、PC、Intel Mac）
> - `linux/arm64` - ARM 64位（Apple Silicon Mac、AWS Graviton、树莓派 4/5）

**自己构建镜像：**

```bash
git clone https://github.com/KuekHaoYang/KVideo.git
cd KVideo
docker build -t kvideo .
docker run -d -p 3000:3000 --name kvideo kvideo
```

**使用 Docker Compose：**

```bash
docker-compose up -d
```

#### 选项 4：传统 Node.js 部署

```bash
# 1. 克隆仓库
git clone https://github.com/KuekHaoYang/KVideo.git
cd KVideo

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 启动生产服务器
npm start
```

应用将在 `http://localhost:3000` 启动。

## 🔄 如何更新

### Vercel 部署

Vercel 会自动检测 GitHub 仓库的更新并重新部署，无需手动操作。

### Docker 部署

当有新版本发布时：

```bash
# 停止并删除旧容器
docker stop kvideo
docker rm kvideo

# 拉取最新镜像
docker pull kuekhaoyang/kvideo:latest

# 运行新容器
docker run -d -p 3000:3000 --name kvideo kuekhaoyang/kvideo:latest
```

### Node.js 部署

```bash
cd KVideo
git pull origin main
npm install
npm run build
npm start
```

> **🔄 自动化部署**：本项目使用 GitHub Actions 自动构建和发布 Docker 镜像。每次代码推送到 main 分支时，会自动构建多架构镜像并推送到 Docker Hub。

## 🤝 贡献代码

我们非常欢迎各种形式的贡献！无论是报告 Bug、提出新功能建议、改进文档，还是提交代码，你的每一份贡献都让这个项目变得更好。

**想要参与开发？请查看 [贡献指南](CONTRIBUTING.md) 了解详细的开发规范和流程。**

快速开始：
1. **报告 Bug**：[提交 Issue](https://github.com/KuekHaoYang/KVideo/issues)
2. **功能建议**：在 Issues 中提出你的想法
3. **代码贡献**：Fork → Branch → PR
4. **文档改进**：直接提交 PR

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

感谢以下开源项目：

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Zustand](https://github.com/pmndrs/zustand) - 状态管理
- [React](https://react.dev/) - UI 库

## 📞 联系方式

- **作者**：[KuekHaoYang](https://github.com/KuekHaoYang)
- **项目主页**：[https://github.com/KuekHaoYang/KVideo](https://github.com/KuekHaoYang/KVideo)
- **问题反馈**：[GitHub Issues](https://github.com/KuekHaoYang/KVideo/issues)





---

<div align="center">
  Made with ❤️ by <a href="https://github.com/KuekHaoYang">KuekHaoYang</a>
  <br>
  如果这个项目对你有帮助，请考虑给一个 ⭐️
</div>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=KuekHaoYang/KVideo&type=date&legend=top-left)](https://www.star-history.com/#KuekHaoYang/KVideo&type=date&legend=top-left)