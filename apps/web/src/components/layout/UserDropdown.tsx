import { useEffect, useState } from "react";
import { useActions } from "@/stores/editor/useStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/ui/dropdown-menu";
import { Button } from "@/lib/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/ui/avatar";

export function UserDropdown() {
  const { data: sessionData } = useSession();
  const { setUser } = useActions();

  // sync session to websocket presence, should be moved.
  useEffect(() => {
    setUser({ name: sessionData?.user.name || "unknown" });
  }, [setUser, sessionData]);

  if (!sessionData) {
    return (
      <Button variant="outline" onClick={() => signIn("google")}>
        Login
      </Button>
    );
  }
  const user = sessionData.user;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="user-dropdown">
          <Avatar>
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={14}>
          <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
