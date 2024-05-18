import ActiveLink from "@/components/ActiveLink";

export default function userProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>BIO GOES HERE</div>
      <div className="flex justify-around py-4 w-full flex-1">
        <ActiveLink pathname="posts">Posts</ActiveLink>
        <ActiveLink pathname="likes">Likes</ActiveLink>
        <ActiveLink pathname="following">Following</ActiveLink>
      </div>
      {children}
    </>
  );
}
