import { sql } from "@vercel/postgres";
import Post from "@/components/Post";
import Sort from "@/components/Sort";
import { Suspense } from "react";
import BackButton from "@/components/BackButton";
import LoadingSpin from "@/components/LoadingSpin";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { getUserIdFromClerkId } from "@/lib/helper_functions";
export const revalidate = 0;

export default async function Following({
  params: { userid },
  searchParams,
}: {
  params: { userid: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const curUser = await getUserIdFromClerkId();

  const { rows: msg } =
    await sql`SELECT m.*, u.username, u.imglink from nextmessages m JOIN nextusers u ON m.user_id = u.id join nextuser_follows f ON u.id = f.follow_id WHERE f.user_id = ${userid} ORDER BY m.created DESC;`;
  if (searchParams?.sort == "asc") msg?.reverse();
  return (
    <Suspense fallback={<LoadingSpin></LoadingSpin>}>
      <div className="flex justify-between w-full pr-4 pb-4">
        <BackButton>
          <HiArrowUturnLeft />
        </BackButton>
        <Sort url={`likes/`}></Sort>
      </div>
      {msg.length == 0 ? (
        `${
          curUser == userid ? "You are " : "This user is  "
        }not following any one yet!`
      ) : (
        <div className="grid grid-cols-8 gap-4">
          {msg.map((x) => (
            <Post key={x.id} post={x} curUser={curUser}></Post>
          ))}
        </div>
      )}
    </Suspense>
  );
}
