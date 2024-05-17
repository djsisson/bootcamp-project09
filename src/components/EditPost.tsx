"use client";

import SubmitButton from "./submit";
import BackButton from "./BackButton";
import { Input } from "./ui/input";
import { useRef } from "react";

export default function EditPost({
  editPostHandler,
  originalMessage,
}: {
  editPostHandler: any;
  originalMessage: string;
}) {
  const ref = useRef<HTMLFormElement>(null);


  return (
    <div className="px-4">
      <form ref={ref}
        action={async (formData) => {
          await editPostHandler(formData);
          ref.current?.reset();
        }} className="flex gap-4">
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
            defaultValue={originalMessage}
          />
        </div>
        <SubmitButton>Edit</SubmitButton>
        <BackButton>Cancel</BackButton>
      </form>
    </div>
  );
}
