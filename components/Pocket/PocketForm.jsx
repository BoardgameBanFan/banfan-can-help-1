"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";
import SelectGameDrawer from "@/components/Pocket/SelectGameDrawer";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nullable(),
});

function PocketForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "games",
  });

  const onSubmit = async data => {
    console.log(data);
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>敘述</FormLabel>
              <FormControl>
                <Textarea rows="5" className="resize-none" placeholder="敘述 ..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <SelectGameDrawer
          triggerComponent={
            <Button variant="outline" className="mt-2 w-full">
              <Dices />
              新增遊戲
            </Button>
          }
          onGameSelected={game => {
            append(game);
          }}
        />

        <input type="submit" />

        {fields.map((game, index) => (
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
                      rows="5"
                      className="resize-none mt-2"
                      placeholder="敘述 ..."
                      {...field}
                    />
                  </FormControl>
                </div>
              </div>
            )}
          />
        ))}
      </form>
    </Form>
  );
}

export default PocketForm;
