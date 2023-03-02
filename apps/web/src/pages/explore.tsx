import { Loader2 } from "lucide-react";
import { api } from "@/utils/api";
import Layout from "@/components/home/Layout";
import ModelGrid from "@/components/home/ModelGrid";
import Pagination from "@/components/shared/Pagination";
import { useState } from "react";

const LIMIT = 16;

export default function Explore() {
  const [page, setPage] = useState(0);
  const { data } = api.model.getPublished.useQuery({ limit: LIMIT, page });

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-10 py-8 md:px-16">
        <h1 className="text-2xl font-bold">Models</h1>
      </div>
      <div className="mx-auto max-w-7xl px-10 py-8 md:px-16">
        {!!data ? (
          <>
            <ModelGrid models={data.data} />
            <Pagination
              className="my-4"
              limit={LIMIT}
              page={page}
              total={data.count}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>
    </Layout>
  );
}
