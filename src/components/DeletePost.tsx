"use client";
import { HiOutlineTrash } from "react-icons/hi";
import { deletePost } from "@/lib/helper_functions";

export default function DeletePost({ msgid }: { msgid: string }) {
  return (
    <div
      title="Delete Post"
      className="cursor-pointer"
      onClick={() => deletePost(msgid)}
    >
      <HiOutlineTrash />
    </div>
  );
}
