import { useRouter } from "next/router";
import { StoreProvider } from "@/stores/editor/useStore";
import Editor from "@/components/editor";

import { api } from "@/utils/api";
import { useEffect } from "react";

export default function EditModel() {
  const router = useRouter();
  const id = router.query.id as string;

  // force only fetch once
  const { data: model, refetch } = api.model.get.useQuery(
    { id },
    { enabled: false }
  );
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  if (!model) return null;

  return (
    <div className="h-full w-full">
      <Editor model={model} />
    </div>
  );
}
