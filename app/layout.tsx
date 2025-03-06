import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { Header } from "../components/layout/header";
import "./globals.css";
import type React from "react";
import QueryProvider from "../providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
