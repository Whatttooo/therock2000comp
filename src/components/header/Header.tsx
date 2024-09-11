"use client";

import Link from "next/link";
import { AudioLines, HandMetal, House, Menu, Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  return (
    <div className="flex h-full max-h-screen flex-col gap-2 md:border-r">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 md:min-h-20">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <HandMetal color="#E23670" />
          <span className="">Rock2000</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start gap-4 px-2 text-sm font-medium lg:px-4 lg:my-4">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname === "/" && "bg-muted text-primary"
            )}
          >
            <House />
            Home
          </Link>
          <Link
            href="/played-songs"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname === "/played-songs" && "bg-muted text-primary"
            )}
          >
            <AudioLines />
            Played songs
          </Link>
        </nav>
      </div>
    </div>
  );
}
