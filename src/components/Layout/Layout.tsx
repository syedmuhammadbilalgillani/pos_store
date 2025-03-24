"use client";
import { ReactNode, useState } from "react";
import { MobileSidebar } from "./MobileSidebar";
import { navigation, teams, userNavigation } from "./navigationItems";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import "@/app/globals.css";
export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="bg-[#D1D5DC] dark:bg-black">
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
          teams={teams}
        />

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col p-2 pr-0">
          <Sidebar navigation={navigation} teams={teams} />
        </div>

        <div className="lg:pl-72">
          <Header
            userNavigation={userNavigation}
            onSidebarOpen={() => setSidebarOpen(true)}
          />
          <main className="mx-2  rounded-lg  h-[89dvh] dark:text-[#ECDFCC] text-[#21242E]">
            <div
              suppressHydrationWarning
              className="mx-auto   max-h-full overflow-auto rounded-lg "
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
