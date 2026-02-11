import Link from 'next/link';
import { signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4 text-zinc-900">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1">
          ← 返回首页
        </Link>
      </div>

      <Card className="w-full max-w-md bg-white border border-zinc-200 shadow-xl shadow-zinc-200/50">
        <CardHeader className="text-center pt-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-zinc-900">创建账户</CardTitle>
          <CardDescription className="text-zinc-500">开始管理您的周期性订阅</CardDescription>
        </CardHeader>
        <form action={async (formData) => { 'use server'; await signup(formData); }}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-zinc-700 font-medium">姓名</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="您的称呼"
                className="bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-zinc-900/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 font-medium">邮箱地址</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-zinc-900/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-700 font-medium">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="至少 6 位字符"
                required
                minLength={6}
                className="bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-zinc-900/10"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all h-10 font-medium shadow-md">
              注册账户
            </Button>
            <p className="text-sm text-zinc-500 text-center">
              已有账户？{' '}
              <Link href="/login" className="text-zinc-900 font-semibold hover:underline">
                立即登录
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      <p className="absolute bottom-8 text-xs text-zinc-400">© 2026 Subscription Guardian</p>
    </div>
  );
}
