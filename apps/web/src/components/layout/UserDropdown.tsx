// import Avatar from "boring-avatars";
import { UserModal } from "./EditUserModal";
import { useEffect, useState } from "react";
import { useActions } from "@/stores/store";
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

  const [showModal, setShowModal] = useState(false);
  const { setUser } = useActions();

  const onEdit = () => {
    setShowModal(true);
  };

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

  // {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
  // const self = useSelf() as { name: string };
  // if (!self) return null;
  const user = sessionData.user;

  return (
    <>
      {mobile && (
        <div className="mb-4 flex flex-col items-center justify-center gap-2 pb-2 text-center">
          {/* <div className="overflow-hidden rounded-full">
            <Avatar
              size={34}
              name={user.name || ""}
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            /> 
          </div> */}
          <Avatar>
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>{user.name}</div>
          <Button variant="outline" onClick={onEdit}>
            Edit Name
          </Button>
        </div>
      )}
      {!mobile && (
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="user-dropdown">
            {/* <Avatar
              size={34}
              name={user.name || ""}
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            /> */}
            <Avatar>
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={14}>
            {/* <DropdownMenuItem onClick={onEdit}>Edit Name</DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <UserModal
        showModal={showModal}
        setShowModal={setShowModal}
        name={user.name || ""}
        onSubmit={({ name }) => {
          setUser({ name });
          setShowModal(false);
        }}
      />
    </>
  );
}
