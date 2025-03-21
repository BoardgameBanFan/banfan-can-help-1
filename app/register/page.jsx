"use client";

import { register } from "@/app/actions/auth";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    username: z.string().nonempty("請輸入暱稱"),
    email: z.string().nonempty("請輸入 Email"),
    password: z.string().nonempty("請輸入密碼"),
    confirmPassword: z.string().nonempty("請再次輸入密碼"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "密碼和確認密碼不一致",
    path: ["confirmPassword"],
  });

function RegisterPage() {
  const [isLoading, setLoading] = useState(false);
  const setUser = useUserStore(state => state.setUser);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async data => {
    try {
      setLoading(true);
      const { email, password, confirmPassword, username } = data;

      const user = await register({
        email,
        password,
        confirmPassword,
        username,
      });

      setUser(user);
      toast.success("註冊成功");
      router.push("/pocket");
    } catch (error) {
      console.log(error);
      toast.error("註冊失敗");
      if (error.message === "email already exists") {
        form.setError("email", { message: "Email 重複" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12">
      <Card className="max-w-[360px] mx-auto">
        <CardHeader>
          <CardTitle>註冊</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>暱稱</FormLabel>
                    <FormControl>
                      <Input placeholder="暱稱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>再次輸入密碼</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm text-center">
                已經有帳號嗎？<Link href="/login">立即登入</Link>
              </p>
            </CardContent>

            <CardFooter>
              <Button disabled={isLoading} type="submit" className="w-full">
                註冊
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default RegisterPage;
