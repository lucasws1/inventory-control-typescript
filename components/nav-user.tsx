"use client";

import {
  IconDotsVertical,
  IconLogin,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signIn, signOut, useSession } from "next-auth/react";

export function NavUser() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut();
  };

  const handleLogin = () => {
    signIn("google");
  };

  // Função para fechar sidebar no mobile quando link é clicado
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const userData = {
    name: session?.user?.name || "Usuário",
    email: session?.user?.email || "usuario@email.com",
    avatar: session?.user?.image || "",
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={userData.avatar}
                  alt={userData.name}
                  onError={(e) => {
                    console.error(
                      "Avatar image failed to load:",
                      userData.avatar,
                    );
                  }}
                />
                <AvatarFallback className="rounded-lg">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {userData.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={userData.avatar}
                    alt={userData.name}
                    onError={(e) => {
                      console.error(
                        "Avatar image failed to load:",
                        userData.avatar,
                      );
                    }}
                  />
                  <AvatarFallback className="rounded-lg">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userData.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {status === "authenticated" && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <a
                      href="/accountSettings"
                      className="w-full cursor-pointer"
                      onClick={handleLinkClick}
                    >
                      <IconUserCircle />
                      Configurações
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <button
                className="w-full cursor-pointer"
                onClick={
                  status === "authenticated" ? handleLogout : handleLogin
                }
              >
                {status === "authenticated" ? (
                  <>
                    <IconLogout /> Logout
                  </>
                ) : (
                  <>
                    <IconLogin /> Login
                  </>
                )}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
