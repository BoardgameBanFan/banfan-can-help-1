"use client";

import { Button } from "@/components/ui/button";
import UserInfo from "@/components/User/UserInfo";
import useUserStore from "@/store/useUserStore";
import { LogIn } from "lucide-react";
import Link from "next/link";

function Navbar() {
  const user = useUserStore(state => state.user);

  return (
    <nav className="px-6 flex items-center justify-end h-[48px] z-10 rounded-sm w-full max-w-[480px] fixed bg-slate-100 shadow-sm top-0 left-1/2 -translate-x-1/2">
      {user ? (
        <UserInfo user={user} />
      ) : (
        <Link href="/login">
          <Button variant="ghost">
            <LogIn />
            登入
          </Button>
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
