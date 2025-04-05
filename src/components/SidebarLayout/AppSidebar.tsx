"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useRoleBasedNavigation } from "@/hooks/useRoleBasedNavigation";
import LanguageSwitcher from "../Language/LanguageSwitcher";
import ThemeSwitch from "../ThemeSwitcher";
import { NavMain, SidebarFooterMenu, SidebarHead } from "./SidebarComponents";

function AppSidebar() {
  const navigation = useRoleBasedNavigation();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHead />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
        <NavMain items={navigation as any} />
        </SidebarGroup>
      </SidebarContent>

      <div className="flex justify-evenly p-2">
        <LanguageSwitcher />
        <ThemeSwitch />
      </div>

      <SidebarFooterMenu />
    </Sidebar>
  );
}
export default AppSidebar;
