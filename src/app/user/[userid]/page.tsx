import { redirect } from "next/navigation";

export default function Profile({ params: { userid } }: { params: any }) {
  return <main>{redirect(`/user/${userid}/posts`)}</main>;
}
