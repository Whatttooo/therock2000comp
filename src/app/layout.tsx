import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";

import { cn } from "@/lib/utils";
import Header from "@/components/header/Header";
import { NowPlayingHeader } from "@/components/now-playing/NowPlaying";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Rock 2000 competition 🎸",
  description: "Check out the leaderboard and the songs played",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "dark min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ReactQueryClientProvider>
          <main className="min-h-screen grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Header />
            <div>
              <NowPlayingHeader />
              <div className="w-full md:p-24">{children}</div>
            </div>
          </main>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
