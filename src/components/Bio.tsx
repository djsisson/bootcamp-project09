"use client";

import { createPortal } from "react-dom";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { setBio } from "@/lib/helper_functions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const Bio = ({
  bioText,
  curUser,
  closeBio,
}: {
  bioText?: string;
  curUser: string;
  closeBio?: any;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  const [documentMounted, setDocumentMounted] = useState(false);
  useEffect(() => {
    setDocumentMounted(true);
  }, []);
  const exit = () => {
    if (closeBio) {
      closeBio(false);
      ref.current?.requestSubmit();
    }
  };

  return documentMounted
    ? createPortal(
        <div
          className="modal absolute flex items-center justify-center inset-0 backdrop-blur-sm"
          onClick={exit}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <form
              ref={ref}
              action={async (formData) => {
                await setBio(formData);
                if (closeBio) closeBio(false);
              }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>User Bio</CardTitle>
                  <CardDescription>Update your bio</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    type="hidden"
                    defaultValue={curUser}
                    name="userid"
                  ></Input>
                  <Input
                    name="bio"
                    defaultValue={bioText}
                    minLength={2}
                    maxLength={30}
                    required
                  ></Input>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Submit</Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default Bio;
