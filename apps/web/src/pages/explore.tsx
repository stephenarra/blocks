import { useRouter } from "next/router";
import { Loader2, Plus } from "lucide-react";

import { api } from "@/utils/api";
import Layout from "@/components/home/Layout";
import ModelList from "@/components/home/ModelList";

export const ExploreModels = () => {
  const { data: models } = api.model.getPublished.useQuery();

  if (!models) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <ModelList models={models} />;
};

export default function Explore() {
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-10 py-8 md:px-16">
        <h1 className="text-2xl font-bold">Models</h1>
      </div>

      <div className="px-10 md:px-16">
        <ExploreModels />
      </div>
    </Layout>
  );
}
