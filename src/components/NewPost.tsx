"use client";

import React from "react";
import SubmitButton from "./submit";
import { Input } from "./ui/input";
import { useRef } from "react";

export default function NewPost({
  newPostHandler,
  postButtonText = "Submit",
}: {
  newPostHandler: any;
  postButtonText?: string;
}) {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className="px-4">
      <form
        ref={ref}
        action={async (formData) => {
          await newPostHandler(formData);
          ref.current?.reset();
        }}
        className="flex gap-4"
      >
        <div className="flex flex-col gap-4 w-full">
          <Input
            className="w-full"
            type="text"
            id="message"
            name="message"
            required
            minLength={2}
            maxLength={200}
            placeholder="Message ..."
          />
        </div>
        <SubmitButton>{postButtonText}</SubmitButton>
      </form>
    </div>
  );
}
