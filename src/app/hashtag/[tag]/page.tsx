import { sql } from "@vercel/postgres";
import Post from "@/components/Post";
import Sort from "@/components/Sort";
import { Suspense } from "react";
import BackButton from "@/components/BackButton";
import { getUserIdFromClerkId } from "@/lib/helper_functions";
import LoadingSpin from "@/components/LoadingSpin";
import { HiArrowUturnLeft } from "react-icons/hi2";
export const revalidate = 0;
export default async function Tags({
  params: { tag },
  searchParams,
}: {
  params: { tag: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userId = await getUserIdFromClerkId();

  const { rows: msg } =
    await sql`SELECT m.*, u.username, u.imglink, (select count(*) from nextlikes where msg_id = m.id) likes, (select count(*) from nextlikes where msg_id = m.id AND user_id = ${userId}) is_liked from nextmessages m JOIN nextusers u ON m.user_id = u.id join nextmessage_tags g on m.id = g.msg_id join nexthashtag h on h.id = g.tag_id where h.tag=${`#${tag}`} ORDER BY m.created DESC;`;
  if (searchParams?.sort == "asc") msg?.reverse();
  return (
    <Suspense fallback={<LoadingSpin></LoadingSpin>}>
      <div className="flex justify-between w-full pr-4 pb-4">
        <BackButton><HiArrowUturnLeft /></BackButton>
        <Sort url={`${tag}/`}></Sort>
      </div>
      <div className="grid grid-cols-8 gap-4">
        {msg.length == 0
          ? `No messages found for tag ${tag}`
          : msg.map((x) => <Post key={x.id} post={x} curUser={userId}></Post>)}
      </div>
    </Suspense>
  );
}
