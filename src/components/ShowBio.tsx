"use client";
import { HiPencil } from "react-icons/hi";
import Bio from "./Bio";
import { useState } from "react";

export default function ShowBio({
  curUser,
  bio,
}: {
  curUser: string;
  bio: string;
}) {
  const [showBio, setShowBio] = useState(false);

  const onClick = () => {
    setShowBio(true);
  };
  return (
    <span className="cursor-pointer px-1 " onClick={onClick}>
      <HiPencil className="text-red-500 hover:text-blue-600" />
      {showBio ? (
        <Bio curUser={curUser} bioText={bio} closeBio={setShowBio}></Bio>
      ) : null}
    </span>
  );
}
