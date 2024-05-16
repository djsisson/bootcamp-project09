"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { QueryResultRow } from "@vercel/postgres";
import { Input } from "@/components/ui/input";

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
      <div className="relative">
        <Input
          className="searchText relative pl-8 bg-search-icon bg-no-repeat bg-[length:2rem_2rem] bg-[centre_1rem] w-48"
          type="search"
          name="Search"
          title="Search"
          onChange={onChange}
          placeholder="Search..."
        ></Input>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 absolute top-2 left-1"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {
        <div className="pt-4 flex flex-col gap-2">
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
