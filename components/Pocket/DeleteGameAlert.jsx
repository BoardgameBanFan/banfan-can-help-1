import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DeleteGameAlert({ triggerCompoent = null, gameName = "", onDelete = () => {} }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerCompoent}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>你確定要刪除遊戲嗎？</AlertDialogTitle>
          <AlertDialogDescription>{gameName} 將從口袋名單中移除</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>確定</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteGameAlert;
