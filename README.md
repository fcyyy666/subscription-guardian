# 🛡️ 订阅卫士 (Subscription Guardian)

掌控你的订阅生活。极简设计，智能追踪，告别“订阅疲劳”。

这是一款采用 Apple 极简风格设计的全栈 SaaS 应用。它可以帮助用户轻松记录和管理所有的周期性支出（如流媒体、健身房、软件订阅等），并提供智能汇率换算、扣款日自动计算等高级功能。

## ✨ 核心功能 (Features)

* **极简操作体验：** 告别繁琐，秒级录入你的订阅服务。
* **智能日期推算：** 根据“首次扣款日”和“计费周期”（月/年/周），系统自动精准计算出你的**下一笔待付**日期。
* **多币种与实时汇率：** 支持输入外币（如 USD, EUR），系统会自动通过汇率 API 实时将其换算为人民币 (CNY) 进行统一展示和统计。
* **无损暂停：** 订阅随时可以标记为“已暂停 (Paused)”，数据不会丢失，且不再计入本月支出总额，随时可恢复。
* **全端响应式：** 采用自适应布局，无论在 PC 宽屏还是手机浏览器上，都能获得如同原生 App 般的丝滑体验。
* **数据安全：** 基于强大的 Supabase Auth 提供银行级账号保护。

## 🛠️ 技术栈 (Tech Stack)

* **框架:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
* **语言:** TypeScript
* **数据库 & 认证:** [Supabase](https://supabase.com/) (PostgreSQL)
* **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
* **样式与组件:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
* **验证:** [Zod](https://zod.dev/) + React Hook Form


## 🚀 本地开发指南 (Getting Started)

1. **克隆项目:**
   ```bash
   git clone [https://github.com/你的用户名/subscription-guardian.git](https://github.com/你的用户名/subscription-guardian.git)
   cd subscription-guardian

2. 安装依赖:
   npm install

3. 配置环境变量:
   在根目录创建 .env.local 文件，并填入你的 Supabase 凭证：

   NEXT_PUBLIC_SUPABASE_URL=你的_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY

4. 启动服务:
   npm run dev

在浏览器中访问 http://localhost:3000 即可预览项目。