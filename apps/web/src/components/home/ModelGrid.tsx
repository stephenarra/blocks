import ModelCard from "../viewer";
import { Model } from "database";
import Link from "next/link";

import { formatRelative } from "date-fns";

export default function ModelGrid({
  models,
  getLink = (m) => `/m/${m.id}`,
}: {
  models: Model[];
  getLink?: (m: Model) => string;
}) {
  console.log(models);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {models.map((model) => (
        <Link
          className="group flex h-72 flex-col overflow-hidden"
          key={model.id}
          href={getLink(model)}
        >
          <div className="flex-1 rounded border border-slate-200 group-hover:border-slate-600 group-hover:bg-gray-50">
            <ModelCard model={model} />
          </div>
          <div className="mt-2 text-slate-700">{model.name}</div>

          {model.author ? (
            <div className="text-sm text-gray-500">{model.author.name}</div>
          ) : (
            <div className="text-sm text-gray-500">
              {formatRelative(model.updatedAt, new Date())}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
