"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BackButton({ children }: { children: any }) {
  const router = useRouter();
  return (
    <Button type="button" onClick={() => router.back()}>
      {children}
    </Button>
  );
}
