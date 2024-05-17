"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { QueryResultRow } from "@vercel/postgres";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { HiOutlineSearch } from "react-icons/hi";

export default function SearchTags({
  searchFunction,
  initialValue,
}: {
  searchFunction: any;
  initialValue: QueryResultRow[];
}) {
  const [tags, setTags] = useState("");
  const [tagsDisplay, setTagsDisplay] = useState(initialValue);
  const pathname = usePathname();
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return clearTimeout(timeout.current as NodeJS.Timeout);
  }, []);

  useEffect(() => {
    const search = async () => {
      const newTags = await searchFunction(tags);
      setTagsDisplay(newTags);
    };
    search();
  }, [tags, searchFunction]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeout.current as NodeJS.Timeout);
    timeout.current = setTimeout(() => setTags(e.target?.value), 300);
  };

  return (
    <div>
      <Separator className="my-4" />
      <div className="relative">
        <Input
          className="searchText relative pl-8 w-48"
          type="search"
          name="Search"
          title="Search"
          onChange={onChange}
          placeholder="Search..."
        ></Input>
        <HiOutlineSearch className="w-6 h-6 absolute top-2 left-1" />
      </div>
      <Separator className="my-4" />
      {
        <div className="flex flex-col gap-2">
          {tagsDisplay
            ? tagsDisplay.map((x) => (
                <Link
                  key={x.tag}
                  href={`/hashtag/${x.tag.slice(1)}`}
                  className={`px-4 py-1 rounded-lg link${
                    pathname === `/hashtag/${x.tag.slice(1)}`
                      ? " bg-blue-600"
                      : " hover:bg-blue-400"
                  }`}
                >
                  {x.tag}
                </Link>
              ))
            : null}
        </div>
      }
    </div>
  );
}
