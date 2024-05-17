"use server";

import SearchTags from "@/components/Search";
import { sql } from "@vercel/postgres";
import Link from "next/link";
import { HiOutlineHome } from "react-icons/hi";

export default async function Sidebar() {
  async function searchTags(search = "") {
    "use server";
    try {
      const { rows: msgs } =
        await sql`select t.tag as tag, COUNT(m.tag_id) as count FROM nextmessage_tags as m INNER JOIN nexthashtag as t ON m.tag_id = t.id WHERE tag LIKE ${`%${search}%`} GROUP BY m.tag_id, t.tag ORDER BY count DESC LIMIT 10;`;
      return msgs;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const initialValue = await searchTags();

  return (
    <div className="max-h-svh border border-solid sticky top-0 p-4 rounded-r-lg hidden md:block flex-shrink-0">
      <Link href={"/home"}>
        <h2 className="flex rounded-lg justify-center my-2 py-1 hover:bg-blue-400">
          <div className="flex gap-2 items-center">
            <HiOutlineHome />
            <div>Home</div>
          </div>
        </h2>
      </Link>
      <SearchTags
        searchFunction={searchTags}
        initialValue={initialValue}
      ></SearchTags>
    </div>
  );
}
