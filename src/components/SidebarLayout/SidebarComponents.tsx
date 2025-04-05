"use client";
import { Logout } from "@/api/apiFuntions";
import { Tenant, User } from "@/constant/types";
import { useTenantStore } from "@/stores/tenantStore";
import { useUserStore } from "@/stores/userStore";
import Cookies from "js-cookie";
import { ChevronUp, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import TranslatedText from "../Language/TranslatedText";

export const SidebarHead = () => {
  const tenant = useTenantStore((state) => state.tenant) as Tenant | null;
  const user = useUserStore((state) => state.user) as User | null;
  const router = useRouter();
  // Use useMemo for the company logo to avoid re-renders
  const companyLogo = useMemo(
    () => (
      <Image
        alt={`${tenant?.name || "Company"} Logo`}
        src={tenant?.logoUrl?.trim() || "/placeholder.jpg"}
        width={64}
        height={64}
        className="h-16 w-16 object-cover rounded-full shadow-md border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-all duration-200"
        priority
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = "/placeholder.jpg";
        }}
        loading="eager"
      />
    ),
    [tenant?.logoUrl, tenant?.name]
  );
  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 rounded-lg transition-colors duration-200 cursor-pointer group">
      <div className="relative mb-2">
        {companyLogo}
        {user?.role === "admin" && (
          <div
            onClick={() => router.push("/admin/store/edit")}
            className="absolute -bottom-1 -right-1 bg-gray-100 dark:bg-gray-700 p-0.5 px-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 group-amber-500 dark:group-amber-500 transition-colors duration-200"
          >
            <i className="fa-duotone fa-solid fa-pen text-xs rounded-full"></i>
          </div>
        )}
      </div>

      <div className="hidden group-hover:block absolute bg-gray-800 text-white text-xs px-2 py-1 rounded-md -top-8 whitespace-nowrap">
        Edit store details
      </div>
    </div>
  );
};

export function NavMain({
  items,
}: {
  items: {
    label: string;
    items: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      items?: {
        title: string;
        url: string;
      }[];
    }[];
  }[];
}) {
  return (
    <>
      {items?.map((group) => (
        <SidebarGroup key={group?.label}>
          <SidebarGroupLabel>{group?.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group?.items?.map((item) =>
              item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item?.title}
                  asChild
                  defaultOpen={item?.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item?.title}>
                        {item?.icon && <item.icon />}
                        <span>
                          <TranslatedText textKey={item?.title ?? ""} />
                        </span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item?.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem?.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem?.url}>
                                <span>{subItem?.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item?.title}>
                  <Link href={item?.url}>
                    <SidebarMenuButton tooltip={item?.title}>
                      {item?.icon && <item.icon />}
                      <span>
                        <TranslatedText textKey={item?.title ?? ""} />
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
export const SidebarFooterMenu = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user) as User | null;
  const clearTenant = useTenantStore((state) => state.clearTenant);
  const clearUser = useUserStore((state) => state.clearUser);
  const handleLogout = useCallback(async () => {
    try {
      const res = await Logout();
      toast.success(res.message);
      Cookies.remove("accessToken");
      clearUser();
      clearTenant();
      router.push("/");
      localStorage.clear();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error during logout ${errorMessage}`);
      // console.error("Error during logout:", errorMessage);
    }
  }, [router, clearUser, clearTenant]);
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 /> {user?.firstName ?? ""} {user?.lastName ?? ""}
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              {/* <DropdownMenuItem></DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem> */}
              <DropdownMenuItem onClick={handleLogout}>
                Sign out
              </DropdownMenuItem>
              {/* <DropdownMenuItem></DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
