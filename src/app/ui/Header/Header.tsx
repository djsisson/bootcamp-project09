import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Bio from "@/components/Bio";
import { sql } from "@vercel/postgres";
import { getUserIdFromClerkId } from "@/lib/helper_functions";

import CustomUserButton from "@/components/CustomUserButton";

export default async function Header() {
  const userid = await getUserIdFromClerkId();
  const { rows: hasbio } =
    await sql`select id, bio from nextusers where id = ${userid};`;

  return (
    <div className="flex justify-between py-2 px-4 bg-primary-foreground items-center">
      <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
        Twedditx
      </div>
      <div>
        <SignedOut>
          <SignInButton fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" />
        </SignedOut>
        <SignedIn>
          <CustomUserButton />
          {hasbio[0]?.bio ? null : (
            <Bio curUser={hasbio[0]?.id} bioText={hasbio[0]?.bio}></Bio>
          )}
        </SignedIn>
      </div>
    </div>
  );
}
