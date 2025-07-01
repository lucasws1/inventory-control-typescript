import { cn } from "@/lib/utils";
const cardContent = {
  title: "Vendas",
  description: "Vendas no último mês",
};
export const CardBody = ({ className = "" }) => (
  <div className={cn("p-4 text-start md:p-6", className)}>
    <h3 className="mb-1 text-lg font-bold text-zinc-200">
      {cardContent.title}
    </h3>
    <p className="text-sm text-wrap text-zinc-500">{cardContent.description}</p>
  </div>
);
//======================================
export const CardWithGridEllipsis = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="w-full overflow-hidden rounded-md border p-1 dark:border-zinc-900 dark:bg-zinc-950">
    <div className="size-full bg-[url(/grid-ellipsis.svg)] bg-[length:25px_25px] bg-repeat">
      <div className="size-full bg-gradient-to-tr from-zinc-950 via-zinc-950/70 to-zinc-950">
        {children}
      </div>
    </div>
  </div>
);
