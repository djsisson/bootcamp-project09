"use client";

import { Badge } from "@/components/ui/badge";
import { HiOutlineHeart } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { likePost, reValidateAfterLike } from "@/lib/helper_functions";
import { motion } from "framer-motion";

export default function LikeButton({
  isLiked,
  likes,
  curUser,
  msgId,
}: {
  isLiked: boolean;
  likes: number;
  curUser: string;
  msgId: string;
}) {
  const [liked, setLiked] = useState(isLiked as boolean);
  const [totalLikes, setTotalLikes] = useState(likes as number);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLiked(isLiked);
    setTotalLikes(likes);
  }, [isLiked, likes]);

  const onClick = async () => {
    if (!curUser || updating) return;
    setUpdating(true);
    setLiked(!liked);
    setTotalLikes((x) => (liked ? +x - 1 : +x + 1));
    const data = await likePost(curUser, msgId, !liked);
    setLiked(data.is_liked == "1" ? true : false);
    setTotalLikes(data.likes as number);
    await reValidateAfterLike(curUser);
    setUpdating(false);
  };

  return curUser ? (
    <div onClick={onClick} className="cursor-pointer absolute">
      <motion.div whileTap={{ scale: 3 }} transition={{ duration: 0.5 }}>
        <Badge variant={"outline"}>
          <HiOutlineHeart className={liked ? "fill-red-600" : ""} />
          <span className="px-2 italic">{totalLikes}</span>
        </Badge>
      </motion.div>
    </div>
  ) : (
    <Badge variant={"outline"}>
      <HiOutlineHeart />
      <span className="px-2 italic">{totalLikes}</span>
    </Badge>
  );
}
