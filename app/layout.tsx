import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { Header } from "../components/layout/header";
import "./globals.css";
import type React from "react";
import QueryProvider from "../providers/query-provider";
import { AuthProvider } from "../providers/auth-context";
import { AlertProvider } from "@/providers/alert-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning={true}>
        <QueryProvider>
          <AlertProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <SidebarProvider>
                  <Header />
                  <AppSidebar />
                  <SidebarInset>
                    <div className="mt-16 w-full overflow-y-auto">
                      {children}
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </ThemeProvider>
            </AuthProvider>
          </AlertProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
