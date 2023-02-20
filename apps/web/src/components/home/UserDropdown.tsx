import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/ui/dropdown-menu";
import { Button } from "@/lib/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/ui/avatar";

export function UserDropdown({ mobile = false }: { mobile?: boolean }) {
  const { data: sessionData } = useSession();

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
      {mobile && (
        <div className="mb-4 flex flex-col items-center justify-center gap-2 pb-2 text-center">
          <Avatar>
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>{user.name}</div>
          <Button variant="outline" onClick={() => signOut()}>
            Log out
          </Button>
        </div>
      )}
      {!mobile && (
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="user-dropdown">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={14}>
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
