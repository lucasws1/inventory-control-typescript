"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  onItemClick,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
  onItemClick?: (item: { title: string; url: string; icon: Icon }) => void;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                // asChild={!onItemClick}
                // onClick={onItemClick ? () => onItemClick(item) : undefined}
              >
                {onItemClick ? (
                  <button
                    className="flex w-full cursor-pointer items-center justify-between"
                    onClick={() => onItemClick(item)}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                    {item.title === "Pesquisar" && (
                      <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    )}
                  </button>
                ) : (
                  <a
                    href={item.url}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                    {item.title === "Pesquisar" && (
                      <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    )}
                  </a>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
