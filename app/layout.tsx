import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { GlobalLoadingProvider } from "@/components/ui/GlobalLoadingProvider"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { ScreenFieldsProvider } from "@/contexts/ScreenFieldsContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ayuu - Healthcare Management System",
  description: "Role-based patient slot booking system"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GlobalLoadingProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <ScreenFieldsProvider>
                {children}
              </ScreenFieldsProvider>
            </ThemeProvider>
          </AuthProvider>
        </GlobalLoadingProvider>
      </body>
    </html>
  )
}
