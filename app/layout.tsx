import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { GlobalLoadingProvider } from "@/components/ui/GlobalLoadingProvider"
import { RouteLoadingListener } from "@/components/ui/route-loading-listener"
import { MantineProvider } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ayuu - Healthcare Management System",
  description: "Role-based patient slot booking system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <MantineProvider>
          <GlobalLoadingProvider>
            <RouteLoadingListener />
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </GlobalLoadingProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
