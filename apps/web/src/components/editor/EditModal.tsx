import {
  useState,
  type Dispatch,
  type SetStateAction,
  useEffect,
  FormEvent,
  ChangeEvent,
} from "react";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { Dialog, DialogContent } from "@/lib/ui/dialog";
import { Checkbox } from "@/lib/ui/checkbox";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { api } from "@/utils/api";
import { useRouter } from "next/router";

interface ModelProps {
  id: string;
  name: string;
  onClose: () => void;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const EditModal = ({
  id,
  showModal,
  setShowModal,
  onClose,
}: ModelProps) => {
  const router = useRouter();
  const utils = api.useContext();

  const [form, setForm] = useState({ name: "", published: false });

  const { data: model } = api.model.get.useQuery({ id });
  useEffect(() => {
    setForm((value) => ({
      name: model?.name || "",
      published: model?.published || false,
    }));
  }, [model]);

  const updateModel = api.model.update.useMutation({
    onSuccess: () => {
      utils.model.get.invalidate();
    },
    onError: (e) => {
      toast(e.message);
    },
  });
  const deleteModel = api.model.delete.useMutation({
    onSuccess: () => {
      utils.model.get.invalidate();
      router.push("/dashboard");
    },
    onError: (e) => {
      toast(e.message);
    },
  });

  return (
    <>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <div className={"flex flex-col bg-white p-6 pt-8"}>
            <form
              onSubmit={(e) => {
                updateModel.mutate({ id, data: form });
                onClose();
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
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="flex items-center mt-4 space-x-2">
                <Checkbox
                  id="public"
                  checked={form.published}
                  onCheckedChange={(val) => {
                    setForm({ ...form, published: !!val });
                  }}
                />
                <label
                  htmlFor="public"
                  className="text-sm font-medium leading-none"
                >
                  Public
                </label>
              </div>

              <div className="flex items-center justify-between mt-8">
                <Button
                  onClick={() => {
                    deleteModel.mutate({ id });
                  }}
                  variant="outline"
                >
                  Delete
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};
