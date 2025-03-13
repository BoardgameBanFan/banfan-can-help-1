"use client";

import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserStore from "@/store/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().nonempty("請輸入 Email"),
  password: z.string().nonempty("請輸入密碼"),
});

function LoginPage() {
  const [isLoading, setLoading] = useState(false);
  const setUser = useUserStore(state => state.setUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async data => {
    try {
      setLoading(true);
      const { email, password } = data;

      const user = await login({
        email,
        password,
      });
      setUser(user);

      toast.success("登入成功");

      const url = searchParams.get("redirect") || "/pocket";
      router.push(url);
    } catch {
      toast.error("登入失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12">
      <Card className="max-w-[360px] mx-auto">
        <CardHeader>
          <CardTitle>登入</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密碼</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm text-center">
                沒有帳號嗎？<Link href="/register">立即註冊</Link>
              </p>
            </CardContent>

            <CardFooter>
              <Button disabled={isLoading} type="submit" className="w-full">
                登入
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;
