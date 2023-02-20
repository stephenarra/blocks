import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { Dialog, DialogContent } from "@/lib/ui/dialog";

interface ModelProps {
  name: string;
  onSubmit: (data: { name: string }) => void;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const EditModal = ({
  showModal,
  setShowModal,
  onSubmit,
  name: inputName,
}: ModelProps) => {
  const [name, setName] = useState(inputName);
  useEffect(() => {
    setName(inputName);
  }, [inputName]);

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
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
                className="w-full"
                type="text"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button className="mt-4 w-full">Save</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
