'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Loader2 } from 'lucide-react'; // Added Loader2
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    setIsLoading(false);

    if (result?.error) {
      let title = '🤔 登录失败';
      let description = '请检查邮箱和密码';

      if (result.error.includes('Invalid login credentials')) {
        description = '邮箱或密码不太对哦，请再检查一下。';
      } else if (result.error.includes('Email not confirmed')) {
        title = '📫 账号未激活';
        description = '账号还没激活呢，请去邮箱点一下验证链接哦！';
      } else {
        description = result.error;
      }

      toast.error(title, {
        description: description,
        duration: 5000,
      });
    } else {
      toast.success('👋 欢迎回来！', {
        description: '正在加载你的订阅全貌...',
        duration: 3000,
      });
      router.push('/dashboard');
    }
  };

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
          <CardTitle className="text-2xl font-bold text-zinc-900">欢迎回来</CardTitle>
          <CardDescription className="text-zinc-500">登录您的 Subscription Guardian 账户</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-zinc-700 font-medium">密码</Label>
                <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900">忘记密码?</a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-zinc-900/10"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all h-10 font-medium shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 登录中...
                </>
              ) : (
                '立即登录'
              )}
            </Button>
            <p className="text-sm text-zinc-500 text-center">
              还没有账户？{' '}
              <Link href="/signup" className="text-zinc-900 font-semibold hover:underline">
                立即注册
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      <p className="absolute bottom-8 text-xs text-zinc-400">© 2026 Subscription Guardian</p>
    </div>
  );
}
