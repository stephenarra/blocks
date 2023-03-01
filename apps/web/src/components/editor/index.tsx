import { Model } from "database";
import { StoreProvider } from "@/stores/editor/useStore";
import Editor from "./Editor";

export default function EditorRoot({ model }: { model: Model }) {
  return (
    <StoreProvider model={model}>
      <Editor />
    </StoreProvider>
  );
}
