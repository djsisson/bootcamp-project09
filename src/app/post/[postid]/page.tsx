import { sql } from "@vercel/postgres";
import Post from "@/components/Post";
import Sort from "@/components/Sort";
import BackButton from "@/components/BackButton";
import { revalidatePath } from "next/cache";
import NewPost from "@/components/NewPost";
import { Suspense } from "react";
import { upsertTags } from "@/lib/helper_js";
import { getUserIdFromClerkId } from "@/lib/helper_functions";
import { SignedIn } from "@clerk/nextjs";
import LoadingSpin from "@/components/LoadingSpin";
import { redirect } from "next/navigation";

export const revalidate = 0;
export default async function Posts({
  params: { postid },
  searchParams,
}: {
  params: { postid: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userId = await getUserIdFromClerkId();

  const { rows: mainMsg } =
    await sql`SELECT m.*, u.username, u.imglink from nextmessages as m INNER JOIN nextusers as u ON m.user_id = u.id where m.id = ${postid};`;

  if (!mainMsg[0]) return redirect(`/home`);

  const { rows: msg } =
    await sql`SELECT m.*, u.username, u.imglink from nextmessages as m INNER JOIN nextusers as u ON m.user_id = u.id where parent_id=${postid} ORDER BY m.created DESC;`;
  if (searchParams?.sort == "asc") msg?.reverse();

  async function NewCommentFunction(formData: FormData) {
    "use server";
    try {
      const msg = formData.get("message") as string;
      const { rows: msgId } =
        await sql`INSERT INTO nextmessages (user_id, message, parent_id) VALUES (${userId}, ${msg}, ${postid}) RETURNING id`;
      await upsertTags(msgId[0]?.id, msg, false);
      revalidatePath("/home");
      revalidatePath("/post");
      revalidatePath(`/post/${postid}`);
      revalidatePath("/hashtag");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Suspense fallback={<LoadingSpin></LoadingSpin>}>
      <div className="grid grid-cols-8 gap-4 pb-4">
        <Post
          key={mainMsg[0].id}
          post={mainMsg[0]}
          curUser={userId}
          parent_id={postid}
        ></Post>
      </div>
      <SignedIn>
        <NewPost
          newPostHandler={NewCommentFunction}
          postButtonText="Comment"
        ></NewPost>
      </SignedIn>
      <div className="flex justify-between w-full pr-4 py-4">
        <BackButton>Back</BackButton>
        <Sort url={`${postid}/`}></Sort>
      </div>
      {msg.length == 0 ? (
        mainMsg[0].parent_id ? null : (
          <SignedIn><div className="py-4">Be the first to reply!</div></SignedIn>
        )
      ) : (
        <div className="grid grid-cols-8 gap-4 pt-4">
          {msg.map((x) => (
            <Post
              key={x.id}
              post={x}
              curUser={userId}
              parent_id={postid}
            ></Post>
          ))}
        </div>
      )}
    </Suspense>
  );
}
