"use client";

import { Button } from "@/components/ui/button";
import useUserStore from "@/store/useUserStore";
import toLogin from "@/utils/toLogin";
import Link from "next/link";

function AddNewPocketButton() {
  const user = useUserStore(state => state.user);

  console.log(toLogin({ redirect: "/pocket/new" }));

  return (
    <Link href={user ? "/pocket/new" : toLogin({ redirect: "/pocket/new" })}>
      <Button variant="outline">新增清單</Button>
    </Link>
  );
}

export default AddNewPocketButton;
