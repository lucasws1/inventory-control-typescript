import React from "react";
import { Spinner, SpinnerProps } from "./spinners";

const OverlaySpinner = () => {
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
    <div className="scrollbar-hidden absolute inset-0 flex h-full items-center justify-center gap-4 bg-black/70">
      <Spinner variant={randomVariant} size={100} />
    </div>
  );
};

export default OverlaySpinner;
