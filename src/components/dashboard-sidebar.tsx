"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { TAdminNavMenus } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function DashboardSidebar({
  adminNavMenus,
}: {
  adminNavMenus: TAdminNavMenus[];
}) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {adminNavMenus.map((menu) => (
            <SidebarMenuItem key={menu.href}>
              <SidebarMenuButton
                className={cn(pathname === menu.href && "bg-muted")}
                asChild
              >
                <Link href={menu.href}>{menu.name}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
