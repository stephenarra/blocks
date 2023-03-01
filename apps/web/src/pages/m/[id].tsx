import { useRouter } from "next/router";

import { api } from "@/utils/api";
import Viewer from "@/components/viewer";
import Layout from "@/components/home/Layout";

export default function Model() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: model } = api.model.get.useQuery({ id });

  if (!model) return null;

  return (
    <Layout>
      <div className="h-full w-full">
        <Viewer model={model} orbit={true} />
      </div>
    </Layout>
  );
}
