import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { TAdminNavMenus } from "@/lib/types";

const adminNavPages: TAdminNavMenus[] = [
  {
    name: "Home",
    href: "/admin",
  },
  {
    name: "Pages",
    href: "/admin/pages",
  },
  {
    name: "Site Settings",
    href: "/admin/site-settings",
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar adminNavMenus={adminNavPages} />

      <div className="flex-1 px-10">{children}</div>
    </SidebarProvider>
  );
}
