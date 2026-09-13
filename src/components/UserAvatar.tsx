"use client";

import { useMemo } from "react";
import multiavatar from "@multiavatar/multiavatar/esm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    name: string;
    image?: string | null;
  };
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const avatarDataUri = useMemo(() => {
    const rawSvg = multiavatar(user.name);
    return `data:image/svg+xml,${encodeURIComponent(rawSvg)}`;
  }, [user.name]);

  return (
    <Avatar className={className}>
      <AvatarImage src={user.image || avatarDataUri} alt={user.name} />
      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
