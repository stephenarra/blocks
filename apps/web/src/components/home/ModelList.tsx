import ModelCard from "../viewer";
import { Model } from "database";
import Link from "next/link";

export default function ModelList({
  models,
  getLink = (m) => `/m/${m.id}`,
}: {
  models: Model[];
  getLink?: (m: Model) => string;
}) {
  return (
    <div className="mx-auto flex w-full flex-wrap gap-4 first-letter:items-start">
      {models.map((model) => (
        <Link
          className="flex h-72 w-72 flex-col overflow-hidden rounded border border-gray-200 px-4 py-4 hover:bg-gray-50"
          key={model.id}
          href={getLink(model)}
        >
          <div className="flex-1">
            <ModelCard model={model} />
          </div>
          <div>{model.name}</div>
        </Link>
      ))}
    </div>
  );
}
