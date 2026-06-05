# SermonPrep — AI 引导讲道预备平台

通过智慧的提问引导你深入思考神的话语。不是替你预备讲道，而是陪你一起思想。

## 核心理念

SermonPrep 的 AI 教练采用**苏格拉底式引导**——它**只提问，不解答**。
它不会替你查考经文、提供神学解释、或帮你写讲道稿，而是通过精心设计的引导性问题，帮助你自己去研经、反思、应用。

## 六个讲道预备阶段

| 阶段 | 聚焦 | 
|------|------|
| 1. 预备心 | 祷告、选择经文、了解会众需要 |
| 2. 释经 | 历史与文学背景、原文含义 |
| 3. 神学反思 | 基督中心解读、救赎历史 |
| 4. 应用 | 连接会众生活 |
| 5. 结构 | 核心思想、大纲、例证 |
| 6. 讲道呈现 | 转折、例证、实践 |

## 功能

- **多用户平台**：注册登录，每人独立讲道空间
- **AI 教练对话**：流式实时对话，逐字呈现引导问题
- **阶段管理**：自动检测阶段完成并推进到下一阶段
- **讲道大纲**：自动汇编你在各阶段的反思笔记，一键复制

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 + React 19 (App Router) |
| 语言 | TypeScript (strict) |
| 数据库 | SQLite + Prisma 7 |
| 认证 | Auth.js v5 (Credentials Provider) |
| 样式 | Tailwind CSS 4 |
| AI | Anthropic Claude API (Sonnet)，流式 SSE + Prompt Caching |
| 验证 | Zod |

## 快速开始

### 前提条件

- Node.js 22+
- Anthropic API Key（从 [console.anthropic.com](https://console.anthropic.com) 获取）

### 安装

```bash
git clone https://github.com/maxiaovo/sermon_preparing_web.git
cd sermon_preparing_web
npm install
```

### 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-random-secret"   # openssl rand -base64 32
ANTHROPIC_API_KEY="sk-ant-..."
```

### 初始化数据库

```bash
npx prisma db push
npx prisma generate
```

### 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:3000

### 生产构建

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── app/
│   ├── (auth)/                    # 登录/注册页面
│   ├── (dashboard)/               # 受保护的讲道空间
│   │   ├── dashboard/             # 讲道列表
│   │   └── sermons/[id]/          # 讲道工作区 + 大纲
│   ├── api/
│   │   ├── auth/[...nextauth]/    # Auth.js 处理器
│   │   └── sermons/[id]/chat/     # AI 教练 SSE 流式端点
│   └── _lib/
│       ├── coaching/              # AI 教练逻辑（提示词、阶段、API封装）
│       ├── actions/               # Server Actions（认证、讲道CRUD）
│       ├── data/                  # Server Component 数据读取
│       └── schemas.ts             # 共享 Zod schema
├── prisma/
│   └── schema.prisma              # 数据模型定义
└── _components/
    ├── ui/                        # 通用 UI 组件
    └── sermon/                    # 讲道相关组件
```

## 许可证

MIT
