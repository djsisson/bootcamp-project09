import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { getUserIdFromClerkId, upsertTags } from "../lib/helper_functions";
import { Suspense } from "react";
import { SignedIn } from "@clerk/nextjs";
import LoadingSpin from "@/components/LoadingSpin";

export const revalidate = 0;

export default async function posts({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  async function NewPostFunction(formData: { get: (arg0: string) => any }) {
    "use server";
    const userId = await getUserIdFromClerkId();
    try {
      const msg = formData.get("message");
      const { rows: msgId } =
        await sql`INSERT INTO nextmessages (user_id, message) VALUES (${userId}, ${msg}) RETURNING id`;
      await upsertTags(msgId[0]?.id, msg, false);
      revalidatePath("/");
    } catch (error) {
      console.log(error);
    }
  }

  try {
    const { rows: msgs } = await sql`SELECT m.* from messages as m ;`;
    if (searchParams?.sort == "asc") msgs?.reverse();
    return (
      <Suspense fallback={<LoadingSpin></LoadingSpin>}>
        <SignedIn>
          {/* <NewPost newPostHandler={NewPostFunction}></NewPost> */}
          <div>signed in</div>
        </SignedIn>
        <div className="flex justify-end w-full pr-4 pt-2 pb-2">
          {/* <Sort url={"home"}></Sort> */}
        </div>
        <div className="grid grid-cols-6 gap-4">
          {msgs.map((x) => (
            <div className="col-span-6" key={x.id}>
              {x.message}
            </div>
            // <Post key={x.id} post={x} curUser={userId}></Post>
          ))}
        </div>
      </Suspense>
    );
  } catch (error) {
    console.log(error);
    return [];
  }
}
