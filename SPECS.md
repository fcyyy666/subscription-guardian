# 项目名称：Subscription Guardian (订阅卫士) - MVP

## 1. 产品概述
一个个人财务 SaaS 工具，用于追踪周期性订阅服务、计算月度支出并发送付款提醒。
**核心目标：** 帮助用户减少“订阅疲劳”，通过数据可视化节省开支。

## 2. 技术栈 (严格遵守)
- **框架:** Next.js 15 (App Router)
- **语言:** TypeScript
- **样式:** Tailwind CSS + Shadcn/ui (必须使用 CN 别名)
- **数据库:** PostgreSQL (使用 Supabase 托管)
- **ORM:** Drizzle ORM (类型安全的数据库操作)
- **认证:** Supabase Auth (仅支持 Email/Password 和 Google OAuth)
- **状态管理:** React Query (TanStack Query) 用于客户端数据获取，Server Actions 用于数据提交
- **验证:** Zod (前后端统一校验)

## 3. 数据库设计草案 (Schema Draft)

### `users` 表 (用户)
- `id`: UUID (主键, 关联到 Supabase Auth)
- `email`: String (唯一)
- `full_name`: String (昵称)
- `currency_preference`: String (默认: 'CNY')
- `created_at`: Timestamp

### `subscriptions` 表 (订阅项)
- `id`: UUID (主键)
- `user_id`: UUID (外键 -> users.id)
- `name`: String (例如 "Netflix", "Spotify", "健身房")
- `amount`: Decimal (10, 2) (精确到分)
- `currency`: Enum ('CNY', 'USD', 'EUR', 'JPY')
- `billing_cycle`: Enum ('monthly', 'yearly', 'weekly')
- `start_date`: Date (首次扣款日)
- `next_payment_date`: Date (根据周期自动计算)
- `category`: Enum ('Entertainment', 'Tools', 'Utilities', 'Health')
- `status`: Enum ('active', 'cancelled')
- `created_at`: Timestamp

## 4. 核心功能与路由规划

### A. 认证模块
- `/login`: 登录页
- `/signup`: 注册页
- **中间件 (Middleware):** 保护 `/dashboard` 下的所有路由，未登录自动跳回登录页。

### B. 仪表盘 ( `/dashboard` )
- **概览卡片:** 本月总支出、活跃订阅数、未来7天即将扣款金额。
- **订阅列表:** 数据表格，支持按金额/日期排序。
- **图表:** 简单的柱状图 (支出按分类统计)。

### C. 添加/编辑订阅 ( `/dashboard/add` )
- 表单页面。
- **逻辑:** 输入 `start_date` 和 `billing_cycle` 后，前端自动预览 `next_payment_date`。

## 5. 业务逻辑 (特殊情况处理)
1.  **月末逻辑:** 如果用户在1月31日订阅了月付服务，下一次扣款日应自动调整为2月28日(或29日)。
2.  **汇率转换:** MVP 阶段使用硬编码汇率 (1 USD = 7.2 CNY)，后续对接 API。
3.  **数据安全:** 必须启用 RLS (Row Level Security)，用户只能查询 `user_id` 等于自己的数据。

## 6. 开发阶段规划
- 第一阶段: 初始化项目结构，配置数据库连接。
- 第二阶段: 完成认证流程 (Auth)。
- 第三阶段: 实现订阅的增删改查 (CRUD)。
- 第四阶段: 完善仪表盘 UI 和图表。