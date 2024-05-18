import { sql } from "@vercel/postgres";
import Post from "@/components/Post";
import Sort from "@/components/Sort";
import BackButton from "@/components/BackButton";
import { revalidatePath } from "next/cache";
import EditPost from "@/components/EditPost";
import { upsertTags } from "@/lib/helper_js";
import { redirect } from "next/navigation";
import { getUserIdFromClerkId } from "@/lib/helper_functions";
import { SignedIn } from "@clerk/nextjs";

export const revalidate = 0;
export default async function Posts({
  params: { postid },
  searchParams,
}: {
  params: { postid: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userId = await getUserIdFromClerkId();

  if (!userId) redirect("/home");

  const { rows: mainMsg } =
    await sql`SELECT m.*, u.username, u.imglink from nextmessages as m INNER JOIN nextusers as u ON m.user_id = u.id where m.id = ${postid};`;

  if (!mainMsg[0]) return redirect(`/home`);

  const { rows: msg } =
    await sql`SELECT m.*, u.username, u.imglink from nextmessages as m INNER JOIN nextusers as u ON m.user_id = u.id where parent_id=${postid} ORDER BY m.created DESC;`;
  if (searchParams?.sort == "asc") msg?.reverse();

  async function EditCommentFunction(formData: FormData) {
    "use server";
    try {
      const msg = formData.get("message") as string;
      const { rows: msgId } =
        await sql`UPDATE nextmessages set message = ${msg}, updated = now() where id = ${postid} RETURNING id`;
      await upsertTags(msgId[0]?.id, msg, true);
      revalidatePath("/");
      revalidatePath("/posts");
      revalidatePath(`/posts/${postid}`);
      revalidatePath("/hashtag");
      revalidatePath(`/posts/${postid}/Edit`);
    } catch (error) {
      console.log(error);
    }
    return redirect(`/post/${postid}`);
  }

  return (
    <>
      <div className="grid grid-cols-8 gap-4 pb-4">
        <Post
          key={mainMsg[0].id}
          post={mainMsg[0]}
          parent_id={postid}
          curUser={userId}
        ></Post>
      </div>
      <SignedIn>
        <EditPost
          editPostHandler={EditCommentFunction}
          originalMessage={mainMsg[0].message}
        ></EditPost>
      </SignedIn>

      {msg.length == 0 ? null : (
        <>
          <div className="flex justify-between w-full pr-4 py-4">
            <BackButton>Back</BackButton>
            <Sort url={`${postid}/`}></Sort>
          </div>
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
        </>
      )}
    </>
  );
}
