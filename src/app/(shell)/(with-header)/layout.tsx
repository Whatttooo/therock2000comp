import { NowPlayingHeader } from "@/components/now-playing/NowPlaying";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function WithHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 mb-2 md:mb-0 md:sticky md:top-0 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3 px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" />
          <NowPlayingHeader />
        </div>
      </header>
      <div className="content-start md:content-normal mb-8 md:mb-0 w-full">
        <div>{children}</div>
      </div>
    </>
  );
}
