import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import clsx from "clsx";

function UserInfo({ user, className }) {
  return (
    <div className={clsx("flex gap-1 items-center", className)}>
      <p className="text-sm text-gray-800 font-medium">By</p>
      <Avatar className="h-8">
        <AvatarImage className="mx-auto" alt={user.username} src={user.avatar} />
        <AvatarFallback>{user.username}</AvatarFallback>
      </Avatar>
      <p className="text-sm text-gray-800 font-medium">{user.username}</p>
    </div>
  );
}

export default UserInfo;
