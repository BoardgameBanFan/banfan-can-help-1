import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import clsx from "clsx";
import DefaultAvatar from "@/app/images/defaultAvatar.jpg";

function UserInfo({ user, className, prefix = "" }) {
  return (
    <div className={clsx("flex gap-2 items-center", className)}>
      <p className="text-sm text-gray-800 font-medium">{prefix}</p>
      <Avatar className="h-8 w-8">
        <AvatarImage alt={user.username} src={user.avatar || DefaultAvatar.src} />
        <AvatarFallback>{user.username}</AvatarFallback>
      </Avatar>
      <p className="text-sm text-gray-800 font-medium">{user.username}</p>
    </div>
  );
}

export default UserInfo;
