import Link from "next/link";
import DeletePost from "./DeletePost";
import Image from "next/image";
import { Suspense } from "react";
import LoadingSpin from "./LoadingSpin";
import LikeButton from "./LikeButton";
import CustomHoverCard from "./HoverCard";
import { HiPencil } from "react-icons/hi2";
import { BsFillReplyFill } from "react-icons/bs";

export default function Post({
  post,
  curUser,
  parent_id = "",
}: {
  post: any;
  curUser: string;
  parent_id?: string;
}) {
  if (!post) return <div></div>;
  const splitMessageTags = () => {
    const re = new RegExp(/(#[\p{L}0-9-_]+)/giu);
    const newMessage = post.message.split(re);

    return newMessage.map((msg: string, i: number) => {
      if (msg.charAt(0) == "#") {
        return (
          <Link
            key={`tag-${i}`}
            href={`/hashtag/${msg.slice(1)}`}
            className="text-blue-300 hover:text-blue-700"
          >
            {msg}
          </Link>
        );
      } else {
        return msg;
      }
    });
  };
  return (
    <>
      <div className="col-span-1 relative aspect-square bg-primary-foreground place-content-center justify-center rounded-full p-2 hover:ring-2">
        <Suspense fallback={<LoadingSpin></LoadingSpin>}>
          <Link href={`/user/${post.user_id}`}>
            <Image
              className="rounded-full "
              src={post.imglink}
              alt={post.username}
              height={80}
              width={80}
            ></Image>
          </Link>
        </Suspense>
      </div>
      <div className="col-span-7 bg-primary-foreground p-4 pb-2 rounded-3xl">
        <div>
          <div className="flex justify-between items-center">
            <div className="text-xs italic">
              <CustomHoverCard
                userid={`${post.user_id}`}
                curUser={curUser}
                username={post.username}
              ></CustomHoverCard>
            </div>
            <div className="text-xs italic">{post.created?.toUTCString()}</div>
          </div>
          <div>{splitMessageTags()}</div>
          <div className="grid grid-cols-3">
            <div className="place-content-center">
              {post.parent_id ? (
                post.parent_id == parent_id ? null : (
                  <Link
                    title="View Thread"
                    className="text-xs italic"
                    href={`/post/${post.parent_id}`}
                  >
                    View Thread
                  </Link>
                )
              ) : post.id == parent_id ? null : (
                <Link
                  title="View Replies"
                  className="text-xs italic"
                  href={`/post/${post.id}`}
                >
                  {post.replies ? (
                    <div className="flex gap-2">
                      <BsFillReplyFill />
                      {`${post.replies} replies`}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <BsFillReplyFill />
                      {` Reply`}
                    </div>
                  )}
                </Link>
              )}
            </div>
            <div className="col-start-2 relative">
              <LikeButton
                key={post.id}
                isLiked={post?.is_liked == "1" ? true : false}
                likes={post?.likes as number}
                curUser={curUser}
                msgId={post.id}
              ></LikeButton>
            </div>

            {post.user_id == curUser ? (
              <div className="flex text-sm italic gap-4 items-center col-start-3 justify-end">
                <Link title="Edit Post" href={`/post/${post.id}/edit`}>
                  <HiPencil className="text-red-500 hover:text-blue-600" />
                </Link>
                <DeletePost msgid={post.id}></DeletePost>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
