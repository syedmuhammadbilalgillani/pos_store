// import Image from "next/image";
// import { TeamsList } from "./TeamList";
import { NavigationItem, Team } from "./types";
// import { Cog6ToothIcon, PowerIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";

import { Navigation } from "./Navigation";
import { Logout } from "@/api/apiFuntions";
import { useRouter } from "next/navigation";
import { toast } from "../Toast/toast_manager";
import { useTenantStore } from "@/stores/tenantStore";
import Image from "next/image";
import { useUserStore } from "@/stores/userStore";
// import { signOut } from "next-auth/react";
interface SidebarProps {
  navigation: NavigationItem[];
  teams: Team[];
}

// export const Sidebar: React.FC<SidebarProps> = ({ navigation, teams }) => (
export const Sidebar: React.FC<SidebarProps> = ({ navigation }) => {
  const router = useRouter();
  const tenant = useTenantStore((state) => state.tenant);
  const clearTenant = useTenantStore((state) => state.clearTenant);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      const res = await Logout();
      toast.success(res.message);
      router.push("/");
      Cookies.remove("accessToken");
      clearUser();
      clearTenant(); // Clear tenant data from store
      localStorage.clear();
    } catch (error) {
      toast.error("Error during logout");
      console.error("Error during logout:", error);
    }
  };
  return (
    <div
      className={`flex  grow flex-col gap-y-5  overflow-y-auto rounded-lg bg-[#FFFFFF] dark:bg-[#15181E] dark:text-[#ECDFCC] text-[#21242E]  px-6 pb-4`}
    >
      <div className="flex w-full justify-center h-16 shrink-0 items-center">
        <Image
          alt="Company Logo"
          src={tenant?.logoUrl?.trim() || "/api/placeholder/32/32"}
          width={32}
          height={32}
          className="h-10 object-contain w-auto"
          priority
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = "/api/placeholder/32/32";
          }}
        />
        {/* <h1 className="text-center w-full">ADMIN</h1> */}
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7 ">
          <li>
            <Navigation items={navigation} />
          </li>
          {/* <li>
          <TeamsList teams={teams} />
        </li> */}
          <li className="mt-auto">
            <div
              // onClick={() =>
              //   signOut({
              //     callbackUrl: "/",
              //     redirect: true,
              //   })
              // }
              onClick={handleLogout}
              className="group -mx-2 flex gap-x-3 rounded-md p-2   text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#21242E] hover:text-black dark:hover:text-white cursor-pointer"
            >
              {/* <PowerIcon
              aria-hidden="true"
              className="size-6 shrink-0 text-textColor group-hover:text-textColor"
            />  */}
              Logout
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};
// #21242E

// #15181E
