"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import usePocket from "@/hooks/pocket/usePocket";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().nonempty("標題欄位一定要填。"),
  description: z.string().nullable(),
  canAdd: z.boolean(),
  canComment: z.boolean(),
});

function PocketForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      canAdd: false,
      canComment: false,
    },
  });
  const { createPocket } = usePocket();

  const onSubmit = async data => {
    try {
      const { title, description, canAdd, canComment } = data;
      const response = await createPocket({
        title,
        description,
        canAdd,
        canComment,
      });

      toast.success("新增口袋清單成功！");
      router.push(`/pocket/${response._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>標題</FormLabel>
              <FormControl>
                <Input placeholder="標題 ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>敘述</FormLabel>
              <FormControl>
                <Textarea rows="6" className="resize-none" placeholder="敘述 ..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="canAdd"
          render={({ field }) => (
            <FormItem className="mt-4">
              <div className="flex gap-2 items-center">
                <Checkbox
                  id="can-add-checkbox"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel htmlFor="can-add-checkbox">所有人都可以增加遊戲到清單</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="canComment"
          render={({ field }) => (
            <FormItem className="mt-4">
              <div className="flex gap-2 items-center">
                <Checkbox
                  id="can-comment-checkbox"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel htmlFor="can-comment-checkbox">開放評論</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-4 fixed max-w-[480px] left-[50%] -translate-x-1/2 bottom-0 bg-white w-full p-3">
          <Link className="w-full" href="/pocket">
            <Button variant="secondary" className="w-full">
              回列表
            </Button>
          </Link>

          <Button className="w-full" type="submit">
            送出
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PocketForm;
