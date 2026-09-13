import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <SidebarTrigger className="absolute top-4 left-4 z-10 cursor-pointer" />
      {children}
    </div>
  );
}
