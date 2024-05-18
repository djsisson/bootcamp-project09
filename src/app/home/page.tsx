import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { getUserIdFromClerkId } from "../../lib/helper_functions";
import { upsertTags } from "@/lib/helper_js";
import React, { Suspense } from "react";
import { SignedIn } from "@clerk/nextjs";
import LoadingSpin from "@/components/LoadingSpin";
import NewPost from "@/components/NewPost";
import Sort from "@/components/Sort";
import Post from "@/components/Post";

export const revalidate = 0;

export default async function posts({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userId = await getUserIdFromClerkId();

  async function NewPostFunction(formData: FormData) {
    "use server";
    try {
      const msg = formData.get("message") as string;
      const { rows: msgId } =
        await sql`INSERT INTO nextmessages (user_id, message) VALUES (${userId}, ${msg}) RETURNING id`;
      await upsertTags(msgId[0]?.id, msg, false);
      revalidatePath("/home");
    } catch (error) {
      console.log(error);
    }
  }

  try {
    const { rows: msgs } =
      await sql`SELECT m.*, u.imglink, u.username, count(r.*) replies, count(l.*) likes from nextmessages m JOIN nextusers u ON m.user_id = u.id LEFT JOIN nextmessages r on m.id = r.parent_id LEFT JOIN nextlikes l on m.id = l.msg_id where m.parent_id is null GROUP BY m.id, u.username, u.imglink ORDER BY m.created DESC;`;

    if (searchParams?.sort == "asc") msgs?.reverse();
    return (
      <Suspense fallback={<LoadingSpin></LoadingSpin>}>
        <SignedIn>
          <NewPost
            newPostHandler={NewPostFunction}
            postButtonText="Post"
          ></NewPost>
        </SignedIn>
        <div className="flex justify-end w-full pr-4 pt-2 pb-2">
          <Sort url={"home"}></Sort>
        </div>
        <div className="grid grid-cols-8 gap-4">
          {msgs.map((x) => (
            <Post key={x.id} post={x} curUser={userId}></Post>
          ))}
        </div>
      </Suspense>
    );
  } catch (error) {
    console.log(error);
    return [];
  }
}
