import { useRouter } from "next/router";
import { Loader2, Plus } from "lucide-react";

import { api } from "@/utils/api";
import { Button } from "@/lib/ui/button";
import Layout from "@/components/home/Layout";
import ModelGrid from "@/components/home/ModelGrid";

export default function Dashboard() {
  const router = useRouter();
  const { data: models } = api.model.getMine.useQuery();

  const createModel = api.model.create.useMutation({
    onSuccess: (data) => {
      router.push(`/m/${data.id}/edit`);
    },
  });

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-10 py-8 md:px-16">
        <h1 className="text-2xl font-bold">Models</h1>

        <Button
          onClick={async () => {
            createModel.mutate();
          }}
          disabled={createModel.isLoading}
        >
          <Plus className="mr-2 w-4" />
          Create New
        </Button>
      </div>

      {createModel.error && (
        <div className="flex items-center justify-center">
          <p>Something went wrong! {createModel.error.message}</p>
        </div>
      )}

      {models ? (
        <div className="mx-auto w-full max-w-7xl px-10 py-8 md:px-16">
          <ModelGrid models={models} getLink={(m) => `/m/${m.id}/edit`} />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </Layout>
  );
}

Dashboard.requireAuth = true;
