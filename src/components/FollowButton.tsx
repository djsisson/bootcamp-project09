"use client";

import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function FollowButton({
  isFollowing,
  OnUpdate,
}: {
  isFollowing: boolean;
  OnUpdate: any;
}) {
  const [followState, setFollowState] = useState(isFollowing);
  useEffect(() => {
    setFollowState(isFollowing);
  }, [isFollowing]);

  const onClick = () => {
    setFollowState(!followState);
    OnUpdate(!followState);
  };

  return (
    <div onClick={onClick} className="cursor-pointer">
      {followState ? (
        <Badge variant={"destructive"}>Unfollow</Badge>
      ) : (
        <Badge>Follow</Badge>
      )}
    </div>
  );
}
