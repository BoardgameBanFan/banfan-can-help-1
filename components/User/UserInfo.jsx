import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import clsx from "clsx";
import DefaultAvatar from "@/app/images/defaultAvatar.jpg";

function UserInfo({ user, className }) {
  return (
    <div className={clsx("flex gap-1 items-center", className)}>
      <Avatar className="h-8 w-8">
        <AvatarImage alt={user.username} src={user.avatar || DefaultAvatar.src} />
        <AvatarFallback>{user.username}</AvatarFallback>
      </Avatar>
      <p className="text-sm text-gray-800 font-medium">{user.username}</p>
    </div>
  );
}

export default UserInfo;
