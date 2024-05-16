import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

import CustomUserButton from "@/components/CustomUserButton";

export default function Header() {
  return (
    <div className="flex justify-between py-2">
      <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
        Twedditx
      </div>
      <div>
        <SignedOut>
          <SignInButton fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" />
        </SignedOut>
        <SignedIn>
          <CustomUserButton />
        </SignedIn>
      </div>
    </div>
  );
}
