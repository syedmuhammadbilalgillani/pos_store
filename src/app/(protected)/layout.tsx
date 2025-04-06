import RoleGuard from "@/components/RoleGuard";
import { RouteGuard } from "@/components/RouterGuard";
import AppSidebar from "@/components/SidebarLayout/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POS Store | Management Dashboard",
  description:
    "Powerful point-of-sale system for efficient inventory management and sales tracking",
  keywords:
    "POS, point of sale, inventory management, sales tracking, store management",
  openGraph: {
    type: "website",
    url: "https://posstore-omega.vercel.app/dashboard",
    title: "POS Store | Management Dashboard",
    description:
      "Powerful point-of-sale system for efficient inventory management and sales tracking",
    siteName: "POS Store",
    images: [
      {
        url: "https://posstore-omega.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "POS Store Dashboard",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      data-theme="system"
      suppressHydrationWarning
      className={`min-h-screen
        [&::-webkit-scrollbar]:w-1.5
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:cursor-point
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
      `}
    >
      <RoleGuard>
        {/* <RouteGuard> */}
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="p-4">
              <SidebarTrigger />
              {children}
            </SidebarInset>
          </SidebarProvider>
        {/* </RouteGuard> */}
      </RoleGuard>
    </main>
  );
}
