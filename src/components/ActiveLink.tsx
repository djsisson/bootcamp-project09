"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActiveLink({
  pathname,
  children,
}: {
  pathname: string;
  children: React.ReactNode;
}) {
  const activePathname = usePathname();

  const currentlyActive =
    activePathname.slice(activePathname.length - pathname.length) == pathname;

  return (
    <Link href={pathname}>
      <div
        className={`flex justify-center p-4 py-1 rounded-lg link${
          currentlyActive ? " bg-blue-600" : " hover:bg-blue-400"
        }`}
      >
        {children}
      </div>
    </Link>
  );
}
