import Header from "@/app/ui/Header/Header";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Sidebar from "./ui/Sidebar/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twedditx",
  description: "Next JS Social Media",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-svh text-base md:text-lg lg:text-lg xl:text-xl">
              <Header></Header>
              <div className="flex gap-4 relative flex-1">
                <Sidebar></Sidebar>

                <main className="flex flex-1 flex-col gap-4 h-full items-center pt-4">
                  <div className="max-w-prose h-full w-full">{children}</div>
                </main>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
