import { Spinner, SpinnerProps } from "@/components/spinners";

export default function Dashboard() {
  const variants = [
    "default",
    "circle",
    "pinwheel",
    "circle-filled",
    "ellipsis",
    "ring",
    "bars",
    "infinite",
  ];

  const randomVariant = variants[
    Math.floor(Math.random() * variants.length)
  ] as SpinnerProps["variant"];
  return (
    <div className="absolute inset-0 flex h-screen items-center justify-center gap-4 bg-black/80">
      <Spinner variant={randomVariant} size={100} />
    </div>
  );
}
