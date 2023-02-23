import { Button } from "@/lib/ui/button";
import { useRouter } from "next/router";
import Link from "next/link";

import { api } from "../utils/api";
import Layout from "@/components/home/Layout";
import { Plus } from "lucide-react";

import { CubesRenderer } from "@/components/editor/Cubes";
import { Model } from "database";
import { useMemo } from "react";
import { toUint8Array } from "js-base64";
import * as Y from "yjs";
import { SharedState } from "@/stores/sharedDocument";
import { Canvas } from "@react-three/fiber";

const ModelCard = ({ model }: { model: Model }) => {
  const data = useMemo(() => {
    const ydoc = new Y.Doc();
    Y.applyUpdate(ydoc, toUint8Array(model.data));
    const map = ydoc.getMap("cubes").toJSON() as SharedState;
    if (!map.cubes) return [];
    return Object.keys(map.cubes).map((id) => ({ ...map.cubes[id], id }));
  }, [model.data]);

  return (
    <Canvas shadows camera={{ fov: 45, position: [20, 15, 20] }}>
      <ambientLight intensity={0.3} />
      <pointLight castShadow intensity={0.8} position={[200, 200, 0]} />
      <CubesRenderer data={data} />
    </Canvas>
  );
};

export default function Home() {
  const router = useRouter();
  const { data: models } = api.model.getMine.useQuery();

  const createModel = api.model.create.useMutation({
    onSuccess: (data) => {
      router.push(`/m/${data.id}`);
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
        <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-4 px-10 first-letter:items-start md:px-16">
          {models.map((model) => (
            <Link
              className="flex h-72 w-72 flex-col overflow-hidden rounded border border-gray-200 px-4 py-4 hover:bg-gray-50"
              key={model.id}
              href={`/m/${model.id}`}
            >
              <div className="flex-1">
                <ModelCard model={model} />
              </div>
              <div>{model.name}</div>
            </Link>
          ))}
        </div>
      ) : (
        "Loading..."
      )}
    </Layout>
  );
}

Home.requireAuth = true;
