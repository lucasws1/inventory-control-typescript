"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";

export const CardBody = ({
  className = "",
  userName,
  userImage,
}: {
  className?: string;
  userName: string;
  userImage: string;
}) => {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isMobile]);

  const cardContent = {
    title: `Olá, ${userName}!`,
    description: "Bem-vindo ao seu painel de controle",
  };

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_auto] gap-4 p-4 text-start md:p-6",
        className,
      )}
      ref={cardRef}
    >
      <div className="flex w-fit items-center">
        <Image
          src={userImage || "/avatar.png"}
          alt="avatar"
          width={40}
          height={40}
          className="w-fit rounded-md"
        />
      </div>

      <div className="grid w-fit flex-col">
        <div className="w-fit text-lg font-bold text-zinc-200">
          {cardContent.title}
        </div>
        <div className="w-fit text-sm text-wrap text-zinc-500">
          {cardContent.description}
        </div>
      </div>
    </div>
  );
};

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
