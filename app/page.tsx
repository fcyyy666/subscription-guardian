import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7] text-zinc-900 font-sans">
      {/* Navbar Placeholder / Minimal Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-zinc-200/50">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-semibold text-zinc-900 tracking-tight">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span>Subscription Guardian</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/login" className="text-zinc-500 hover:text-zinc-900 transition-colors">登录</Link>
            <Link href="/signup" className="text-zinc-900 hover:text-zinc-600 transition-colors">注册</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center pt-24 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-2xl shadow-zinc-200/50 text-zinc-900 border border-zinc-100">
          <ShieldCheck className="h-10 w-10" />
        </div>

        <h1 className="mb-6 max-w-2xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-7xl">
          掌控你的<br />订阅生活
        </h1>
        <p className="mb-10 max-w-lg text-xl font-medium leading-relaxed text-zinc-500">
          极简设计，智能追踪。<br />
          告别订阅焦虑，从这里开始。
        </p>

        {/* CTA Buttons - inherit existing */}
        <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className="h-12 w-full sm:w-40 rounded-full bg-zinc-900 px-8 text-base font-medium text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:scale-105"
          >
            <Link href="/signup">免费开始</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 w-full sm:w-40 rounded-full border-zinc-300 bg-transparent px-8 text-base font-medium text-zinc-900 transition-all duration-200 hover:bg-zinc-100 hover:border-zinc-400"
          >
            <Link href="/login">登录账户</Link>
          </Button>
        </div>

        {/* Feature Cards - Minimal */}
        <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl w-full px-4">
          {[
            { title: '支出可视化', desc: '直观图表，一目了然' },
            { title: '智能提醒', desc: '扣款前自动通知' },
            { title: '多币种支持', desc: '自动汇率转换' },
            { title: '隐私安全', desc: '本地优先，数据加密' }
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl bg-white p-6 shadow-sm border border-zinc-100 transition-all hover:shadow-md hover:-translate-y-1 text-left"
            >
              <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-900 transition-colors">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-xs text-zinc-400 bg-white border-t border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <p>© 2026 Subscription Guardian</p>
          <p>Designed for Simplicity</p>
        </div>
      </footer>
    </div>
  );
}
