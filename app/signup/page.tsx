'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    setIsLoading(false);

    if (result?.error) {
      let title = '❌ 注册遇到了点小麻烦';
      let description = result.error;

      // Map common Supabase/Auth errors
      if (result.error.includes('User already registered') || result.error.includes('already exists')) {
        title = '⚠️ 账号已存在';
        description = '这个邮箱好像已经注册过了，直接去登录吧。';
      } else {
        description = '请稍后再试，或检查网络连接。';
      }

      toast.error(title, {
        description: description,
        duration: 5000,
      });
    } else {
      toast.success('🎉 注册成功！', {
        description: '请前往邮箱点击验证链接，激活后即可登录。',
        duration: 8000, // Longer duration for important instruction
      });
      e.currentTarget.reset();
      router.push('/login');
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
          <CardTitle className="text-2xl font-bold text-zinc-900">创建账户</CardTitle>
          <CardDescription className="text-zinc-500">开始管理您的周期性订阅</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all h-10 font-medium shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 注册中...
                </>
              ) : (
                '注册账户'
              )}
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
