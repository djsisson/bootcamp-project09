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
import { getUserData, followUser } from "@/lib/helper_functions";
import FollowButton from "./FollowButton";
import { SignedIn } from "@clerk/nextjs";

type hover = {
  id: string;
  username: string;
  bio: string;
  imglink: string;
  count_posts: number;
  count_following: number;
  count_followers: number;
  is_following: string;
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
      const data = await getUserData(userid, curUser);
      setHoverData(data as hover);
    }
    hover();
  }, [userid, showCard, curUser]);

  const OnUpdate = async (isFollowing: boolean) => {
    const data = await followUser(curUser, userid, isFollowing);
    setHoverData(data as hover);
  };

  return (
    <HoverCard onOpenChange={setShowCard}>
      <HoverCardTrigger asChild>
        <Link className="hover:underline italic" href={`/user/${userid}`}>
          @{username}
        </Link>
      </HoverCardTrigger>
      {hoverData.id ? (
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
              <div className="flex gap-4">
                <h4 className="text-sm font-semibold">
                  <Link
                    className="hover:underline italic"
                    href={`/user/${userid}`}
                  >
                    @{username}
                  </Link>
                </h4>
                <SignedIn>
                  {curUser == userid ? null : (
                    <FollowButton
                      isFollowing={hoverData.is_following == "0" ? false : true}
                      OnUpdate={OnUpdate}
                    ></FollowButton>
                  )}
                </SignedIn>
              </div>

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
      ) : null}
    </HoverCard>
  );
}
