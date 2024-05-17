import Link from "next/link";
import DeletePost from "./DeletePost";
import Image from "next/image";
import { Suspense } from "react";
import LoadingSpin from "./LoadingSpin";

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
    <Suspense fallback={<LoadingSpin></LoadingSpin>}>
      <div className="col-span-1 relative aspect-square">
        <Suspense fallback={<LoadingSpin></LoadingSpin>}>
          <Image
            className="rounded-full"
            src={post.imglink}
            alt={post.username}
            height={80}
            width={80}
          ></Image>
        </Suspense>
      </div>
      <div className="col-span-7">
        <div>
          <div className="flex justify-between items-center">
            <div className="text-xs italic">@{post.username}</div>
            <div className="text-xs italic">{post.created?.toUTCString()}</div>
          </div>
          <div>{splitMessageTags()}</div>
          <div className="flex justify-between">
            <div>
              {post.parent_id ? (
                post.parent_id == parent_id ? null : (
                  <Link
                    className="text-xs italic"
                    href={`/post/${post.parent_id}`}
                  >
                    View Thread
                  </Link>
                )
              ) : post.id == parent_id ? null : (
                <Link className="text-xs italic" href={`/post/${post.id}`}>
                  View Replies
                </Link>
              )}
            </div>
            {post.user_id == curUser ? (
              <div className="flex text-xs italic gap-4 items-center">
                <Link href={`/post/${post.id}/edit`}>Edit</Link>
                <DeletePost msgid={post.id}></DeletePost>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
