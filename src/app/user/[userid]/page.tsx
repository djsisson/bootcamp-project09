import { sql } from "@vercel/postgres";
import Post from "@/components/Post";
import Sort from "@/components/Sort";
import { Suspense } from "react";
import BackButton from "@/components/BackButton";
import LoadingSpin from "@/components/LoadingSpin";
import { getUserIdFromClerkId } from "@/lib/helper_functions";
export const revalidate = 0;
export default async function UserPosts({
  params: { userid },
  searchParams,
}: {
  params: { userid: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const curUser = await getUserIdFromClerkId();

  const { rows: msgs } =
    await sql`SELECT m.*, u.username, u.imglink from nextmessages m JOIN nextusers u ON m.user_id = u.id where u.id = ${userid} ORDER BY m.created DESC;`;
  if (searchParams?.sort == "asc") msgs?.reverse();
  return (
    <Suspense fallback={<LoadingSpin></LoadingSpin>}>
      <div className="flex justify-between w-full pr-4 pb-4">
        <BackButton>Back</BackButton>
        <Sort url={`${userid}/`}></Sort>
      </div>
      <div className="grid grid-cols-8 gap-4">
        {msgs.length == 0
          ? `No messages found for user: ${userid}`
          : msgs.map((x) => (
              <Post key={x.id} post={x} curUser={curUser}></Post>
            ))}
      </div>
    </Suspense>
  );
}
