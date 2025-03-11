import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { Edit, Heart, MessageSquareText, Send, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function GameCard({
  ref,
  className,
  index,
  game,
  comment,
  initialEditMode = false,
  onCancel = () => {},
  onSubmit = () => {},
  focusOnMount = false,
}) {
  const [isEdit, setEdit] = useState(initialEditMode);
  const commentRef = useRef(null);

  const handleSubmit = () => {
    const comment = commentRef?.current?.value;

    onSubmit({
      gameId: game._id,
      comment,
    });
  };

  useEffect(() => {
    if (focusOnMount && commentRef.current) {
      commentRef.current.focus();
    }
  }, []);

  return (
    <div className={clsx("border-b-4", className)} ref={ref}>
      <CardHeader>
        <div className="mb-2 mx-auto">
          <Image src={game.image} height={200} width={200} alt={game.name} />
        </div>
        <CardTitle className="text-xl flex justify-center items-center">
          {Number.isInteger(index) ? `${index + 1}. ` : null}
          {game.name} ({game.year_published})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEdit ? (
          <Textarea
            defaultValue={comment}
            ref={commentRef}
            autoFocus
            placeholder="你的想法 ..."
            rows="6"
            className="resize-none "
          />
        ) : (
          <p className="text-gray-800">{comment}</p>
        )}
      </CardContent>
      <CardFooter>
        {isEdit ? (
          <div className="mt-2 flex justify-between gap-4 w-full">
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                setEdit(false);
                onCancel();
              }}
            >
              取消
            </Button>
            <Button className="w-full" onClick={handleSubmit}>
              <Send size={16} />
              送出
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-end">
            <Button variant="icon">
              <Heart className="text-gray-400" />
            </Button>
            <Button variant="icon">
              <MessageSquareText className="text-gray-400" />
            </Button>
            <Button variant="icon" onClick={() => setEdit(true)}>
              <Edit className="text-gray-400" />
            </Button>
            <Button variant="icon">
              <Trash2 className="text-gray-400" />
            </Button>
          </div>
        )}
      </CardFooter>
    </div>
  );
}

export default GameCard;
