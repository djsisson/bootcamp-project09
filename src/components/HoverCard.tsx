"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import LoadingSpin from "./LoadingSpin";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/helper_functions";

type hover = {
  id: string;
  username: string;
  bio: string;
  imglink: string;
  count_posts: number;
  count_following: number;
  count_followers: number;
};

export default function CustomHoverCard({
  userid,
  curUser,
  username,
}: {
  userid: string;
  curUser: string;
  username: string;
}) {
  const [hoverData, setHoverData] = useState({} as hover);
  const [showCard, setShowCard] = useState(false);
  useEffect(() => {
    async function hover() {
      if (!userid || !showCard) return;
      const data = await getUserData(userid);
      setHoverData(data as hover);
    }
    hover();
  }, [userid, showCard]);

  return !showCard ? (
    <Link
      onMouseOver={() => setShowCard(true)}
      className="hover:underline italic"
      href={`/user/${userid}`}
    >
      @{username}
    </Link>
  ) : (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link className="hover:underline italic" href={`/user/${userid}`}>
          @{username}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-100 ring-2">
        <div className="flex justify-between space-x-4">
          <Suspense fallback={<LoadingSpin></LoadingSpin>}>
            <Image
              className="rounded-full"
              src={hoverData?.imglink}
              alt={hoverData?.username}
              height={80}
              width={80}
            ></Image>
          </Suspense>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">
              <Link className="hover:underline italic" href={`/user/${userid}`}>
                @{username}
              </Link>
            </h4>
            <p className="text-sm">{hoverData?.bio as string}</p>
            <div className="flex items-center pt-2 gap-1">
              <span className="text-xs text-muted-foreground">
                Posts: {hoverData?.count_posts}
              </span>
              <span className="text-xs text-muted-foreground">
                Followers: {hoverData?.count_followers}
              </span>
              <span className="text-xs text-muted-foreground">
                Following: {hoverData?.count_following}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
