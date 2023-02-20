import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { Dialog, DialogContent } from "@/lib/ui/dialog";

interface UserModalProps {
  name?: string;
  submitText?: string;
  onSubmit: (data: { name: string }) => void;
  showClose?: boolean;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const UserModal = ({
  showModal,
  setShowModal,
  name: inputName = "",
  submitText = "Submit",
  onSubmit,
  showClose = true,
}: UserModalProps) => {
  const [name, setName] = useState(inputName);
  useEffect(() => {
    setName(inputName);
  }, [inputName]);

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent showClose={showClose}>
        <div className={"flex flex-col bg-white p-6 pt-8"}>
          <form
            onSubmit={(e) => {
              onSubmit({ name });
              e.preventDefault();
            }}
          >
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                data-testid="name-input"
                className="w-full"
                type="text"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button data-testid="profile-submit" className="mt-4 w-full">
              {submitText}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
