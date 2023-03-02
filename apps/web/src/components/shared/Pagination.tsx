import { Button } from "@/lib/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn, ClassValue } from "@/lib/utils";

interface PaginationProps {
  limit: number;
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  className: ClassValue;
}

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  const pageCount = Math.ceil(total / limit);

  if (pageCount <= 1) return null;

  const hasPrev = page > 0;
  const hasNext = page < pageCount - 1;

  return (
    <div className={cn(className, "flex items-center justify-center")}>
      <Button
        variant="ghost"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>
      {[...Array(pageCount)].map((_d, i) => (
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          variant={page === i ? "default" : "ghost"}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        variant="ghost"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

function PreviousButton() {
  return <Button variant="ghost"></Button>;
}

{
  /* <Pagination.Root
  itemsPerPage={itemsPerPage}
  total={total}
  page={page}
  defaultPage={defaultPage}
  onPageChange={(page) => {  } }
>
  <Pagination.Previous></Pagination.Previous>
  <Pagination.List>
    {(items) =>
      items.map((item) => <PaginationItem /> )
    }
  </Pagination.List>
  <Pagination.Next></Pagination.Next>
</Pagination.Root> */
}
