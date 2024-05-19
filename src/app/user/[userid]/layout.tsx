import ActiveLink from "@/components/ActiveLink";
import LoadingSpin from "@/components/LoadingSpin";
import {
  followUser,
  getUserData,
  getUserIdFromClerkId,
} from "@/lib/helper_functions";
import { Suspense } from "react";
import Image from "next/image";
import { SignedIn } from "@clerk/nextjs";
import FollowButton from "@/components/FollowButton";
import { revalidatePath } from "next/cache";
import ShowBio from "@/components/ShowBio";
import { redirect } from "next/navigation";

export default async function userProfile({
  children,
  params: { userid },
}: {
  children: React.ReactNode;
  params: {
    userid: string;
  };
}) {
  const curUser = await getUserIdFromClerkId();
  const userData = await getUserData(userid, curUser);
  if (!userData) redirect("/home");

  const OnUpdate = async (isFollowing: boolean) => {
    "use server";
    const data = await followUser(curUser, userid, isFollowing);
    revalidatePath("");
  };

  return (
    <>
      <div className="flex gap-4 justify-center">
        <div className="relative aspect-square  place-content-center justify-center ">
          <div className="rounded-full p-2 hover:ring-2 bg-primary-foreground">
            <Suspense fallback={<LoadingSpin></LoadingSpin>}>
              <Image
                className="rounded-full "
                src={userData.imglink}
                alt={userData.username}
                height={80}
                width={80}
              ></Image>
            </Suspense>
          </div>
        </div>
        <div className="bg-primary-foreground p-4 pb-2 rounded-3xl">
          <div className="flex justify-between space-x-4">
            <div className="space-y-1">
              <div className="flex gap-4">
                <h4 className="text-sm font-semibold">@{userData.username}</h4>
                <SignedIn>
                  {curUser == userid ? null : (
                    <FollowButton
                      isFollowing={userData.is_following == "0" ? false : true}
                      OnUpdate={OnUpdate}
                    ></FollowButton>
                  )}
                </SignedIn>
              </div>

              <span className="text-sm flex py-2">
                {userid == curUser ? (
                  <ShowBio curUser={curUser} bio={userData?.bio}></ShowBio>
                ) : null}
                {userData?.bio as string}
              </span>
              <div className="flex items-center pt-2 gap-1">
                <span className="text-xs text-muted-foreground">
                  Posts: {userData?.count_posts}
                </span>
                <span className="text-xs text-muted-foreground">
                  Followers: {userData?.count_followers}
                </span>
                <span className="text-xs text-muted-foreground">
                  Following: {userData?.count_following}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-around py-4 w-full flex-1">
        <ActiveLink pathname="posts">Posts</ActiveLink>
        <ActiveLink pathname="likes">Likes</ActiveLink>
        <ActiveLink pathname="following">Following</ActiveLink>
      </div>
      {children}
    </>
  );
}
