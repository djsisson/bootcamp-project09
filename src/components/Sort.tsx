"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import React from "react";

export default function Sort({ url }: { url: string }) {
  const router = useRouter();
  const onChange = (e: string) => {
    router.push(`${url}?sort=${e}`);
  };
  return (
    <div>
      <Select onValueChange={onChange} defaultValue="desc">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort By</SelectLabel>
            <SelectItem value="desc">Newest</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
