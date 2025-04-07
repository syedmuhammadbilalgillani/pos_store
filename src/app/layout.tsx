import I18nClientProvider from "@/components/Language/I18nClientProvider";
import ThemeProvider from "@/components/ThemeProvider";
import type { Metadata } from "next";
import "../components/Language/i18n";
import "./font-6/css/all.css";
import "./font-6/css/sharp-light.css";
import "./font-6/css/sharp-regular.css";
import "./font-6/css/sharp-solid.css";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
// import "./font-6/css/sharp-thin.css";
// import "./font-6/css/sharp-duotone-light.css";
// import "./font-6/css/sharp-duotone-regular.css";
// import "./font-6/css/sharp-duotone-solid.css";
// import "./font-6/css/sharp-duotone-thin.css";
// import "./font-6/css/duotone-light.css";
// import "./font-6/css/duotone-regular.css";
// import "./font-6/css/duotone-thin.css";

export const metadata: Metadata = {
  title: "POS Store | Login",
  description: "Secure login to access your POS Store management dashboard",
  keywords: "POS login, store management login, point of sale login",
  openGraph: {
    type: "website",
    url: "https://posstore-omega.vercel.app/",
    title: "POS Store | Login",
    description: "Secure login to access your POS Store management dashboard",
    siteName: "POS Store",
    images: [
      {
        url: "https://posstore-omega.vercel.app/login-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "POS Store Login"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="system">
      <body
        className={`

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar]:h-1.5!
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
          [&::-webkit-scrollbar-thumb]:cursor-point
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
        `}
        //
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Toaster />
          <I18nClientProvider>{children} </I18nClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
