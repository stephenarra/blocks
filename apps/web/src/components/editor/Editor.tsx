import { useState } from "react";
import { ChevronDown, ChevronLeft, Menu, X } from "lucide-react";

import Users from "@/components/layout/Users";
import { UserDropdown } from "@/components/layout/UserDropdown";
import CanvasControls from "@/components/layout/CanvasControls";
import Controls from "@/components/layout/UndoControls";
import {
  ColorPicker,
  MobileColorPicker,
} from "@/components/layout/ColorPicker";
import Layers from "@/components/layout/Layers";
import ShareButton from "@/components/shared/ShareButton";
import Scene from "@/components/editor/Scene";
import Link from "next/link";
import { useStore } from "@/stores/store";
import { api } from "@/utils/api";

import { EditModal } from "./EditModal";

const Editor = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { id } = useStore();

  const utils = api.useContext();
  const { data: model } = api.model.get.useQuery({ id });
  const updateModel = api.model.update.useMutation({
    onSuccess: () => {
      utils.model.get.invalidate();
      setError(undefined);
    },
    onError: (e) => {
      // todo: show error
      setError(e.message);
    },
  });

  if (!model) return null;

  return (
    <>
      <div className="relative flex h-full w-full flex-col">
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4 rounded bg-gray-100 p-2">
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div
              className="flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-100"
              onClick={() => {
                setShowModal(true);
              }}
            >
              <div>{model.name}</div>
              <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-6">
              <Users />
              <ShareButton />
              <UserDropdown />
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 overflow-hidden">
          {/* Floating Controls */}
          <div className="absolute right-2 top-2 z-10 bg-white shadow">
            <Controls />
          </div>

          {/* Sidebar */}
          <div className="hidden w-[295px] shrink-0 overflow-auto border-r border-gray-200 lg:block">
            <div className="flex flex-col gap-2 p-2">
              <ColorPicker />
              <Layers />
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div className="lg:hidden">
            {mobileMenuOpen && (
              <div className="absolute top-0 bottom-0 left-0 z-20 w-80 overflow-y-auto bg-white shadow lg:hidden">
                <div className="mt-6 flex flex-col gap-4">
                  <Layers />
                </div>
              </div>
            )}
          </div>

          {/* Main */}
          <div className="relative flex-1">
            <Scene />

            {/* Mode Controls */}
            <div className="absolute left-2 top-2 z-10 rounded bg-white p-1 shadow">
              <CanvasControls />
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="flex h-14 shrink-0 items-center justify-between border-t border-gray-200 px-4 lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
          <Users />
          <MobileColorPicker />
        </div>

        <EditModal
          showModal={showModal}
          setShowModal={setShowModal}
          name={model.name || ""}
          onSubmit={({ name }) => {
            updateModel.mutate({ id: model.id, data: { name } });
            setShowModal(false);
          }}
        />
      </div>
    </>
  );
};

export default Editor;
