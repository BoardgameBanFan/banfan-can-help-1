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

  // const { fields, append } = useFieldArray({
  //   control: form.control,
  //   name: "games",
  // });

  const onSubmit = async data => {
    try {
      const response = await createPocket({
        title: data.title,
        description: data.description,
        can_add: data.can_add,
        can_comment: data.can_comment,
      });

      router.push(`/pocket/${response.pocket_id}`);
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

        {/* <SelectGameDrawer
          triggerComponent={
            <Button variant="outline" className="mt-2 w-full">
              <Dices />
              新增遊戲
            </Button>
          }
          onGameSelected={game => {
            append(game);
          }}
        /> */}

        {/* {fields.map((game, index) => (
          <FormField
            key={game.id}
            control={form.control}
            name={`games.${index}.comment`}
            render={({ field }) => (
              <div className="flex mt-4 gap-4 py-4 border-b-2 items-center">
                <div>
                  <Image alt={game.name} src={game.thumbnail} height={140} width={140} />
                </div>
                <div className="flex flex-col w-full">
                  <span className="text-lg font-medium">{game.name}</span>
                  <FormControl>
                    <Textarea
                      rows="4"
                      className="resize-none mt-2"
                      placeholder="敘述 ..."
                      {...field}
                    />
                  </FormControl>
                </div>
              </div>
            )}
          />
        ))} */}

        <div className="fixed max-w-[480px] left-[50%] -translate-x-1/2 bottom-0 bg-white w-full p-3">
          <Button className="w-full" type="submit">
            送出
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PocketForm;
