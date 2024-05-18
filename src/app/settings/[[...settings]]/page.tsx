"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { refresh } from "@/lib/helper_functions";

const UserProfilePage = () => {
  const { resolvedTheme } = useTheme();
  const [documentMounted, setDocumentMounted] = useState(false);
  useEffect(() => {
    setDocumentMounted(true);
  }, []);

  const handleClose = async () => {
    await refresh();
  };

  return documentMounted
    ? createPortal(
        <div
          className="modal absolute flex items-center justify-center inset-0 backdrop-blur-sm"
          onClick={() => {
            handleClose();
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <UserProfile
              path="/settings"
              routing="path"
              appearance={{
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
              }}
            />
          </div>
        </div>,
        document.body
      )
    : null;
};

export default UserProfilePage;
