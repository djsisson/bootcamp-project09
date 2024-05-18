"use server";

import SearchTags from "@/components/Search";
import { sql } from "@vercel/postgres";
import Link from "next/link";
import { HiOutlineHome } from "react-icons/hi";
import { SignedIn } from "@clerk/nextjs";
import { getUserIdFromClerkId } from "@/lib/helper_functions";
import { HiOutlineUser } from "react-icons/hi";
import ActiveLink from "@/components/ActiveLink";

export default async function Sidebar() {
  const userid = await getUserIdFromClerkId();

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
    <div className="max-h-svh border border-solid sticky top-0 p-4 rounded-r-lg hidden md:block flex-shrink-0 gap-4 bg-primary-foreground">
      <div className="flex flex-col gap-4">
        <ActiveLink pathname="/home">
          <div className="flex gap-2 items-center">
            <HiOutlineHome />
            <div>Home</div>
          </div>
        </ActiveLink>
        <SignedIn>
          <ActiveLink pathname={`/user/${userid}`}>
            <div className="flex gap-2 items-center">
              <HiOutlineUser />
              <div>Profile</div>
            </div>
          </ActiveLink>
        </SignedIn>
      </div>

      <SearchTags
        searchFunction={searchTags}
        initialValue={initialValue}
      ></SearchTags>
    </div>
  );
}
