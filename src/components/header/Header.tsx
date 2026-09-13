"use client";

import Link from "next/link";
import {
  AudioLines,
  HandMetal,
  House,
  LogIn,
  UserPlus,
  ChevronsUpDown,
  LogOut,
  User,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";
import { UserAvatar } from "../UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };
  const isMobile = useIsMobile();

  return (
    <div className="flex md:h-full md:max-h-screen mb-4 pb-4 md:pb-0 md:mb-0 border-b md:border-b-0 flex-col gap-2 md:justify-between md:border-r md:sticky md:top-0">
      <div className="md:flex-1 flex flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 md:min-h-20">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <HandMetal color="#E23670" />
            <span className="">Rock2000</span>
          </Link>
        </div>
        <nav className="grid items-start gap-4 px-2 text-sm font-medium lg:px-4 lg:my-4">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname === "/" && "bg-muted text-primary",
            )}
          >
            <House />
            Home
          </Link>
          <Link
            href="/played-songs"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname === "/played-songs" && "bg-muted text-primary",
            )}
          >
            <AudioLines />
            Played songs
          </Link>
        </nav>
      </div>
      <nav className="grid items-start gap-4 px-2 text-sm font-medium lg:px-4 lg:my-4">
        {!session ? (
          <>
            <Link
              href="/sign-in"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === "/sign-in" && "bg-muted text-primary",
              )}
            >
              <LogIn />
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === "/sign-up" && "bg-muted text-primary",
              )}
            >
              <UserPlus />
              Sign up
            </Link>
          </>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <UserAvatar
                      className="h-8 w-8 rounded-lg"
                      user={session.user}
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {session.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {session.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <UserAvatar
                        className="h-8 w-8 rounded-lg"
                        user={session.user}
                      />
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {session.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {session.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/dashboard">
                      <DropdownMenuItem>
                        <User />
                        Dashbooard
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </nav>
    </div>
  );
}
