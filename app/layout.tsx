import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kraftgene AI Inc. - AI for Sustainable Energy & Environmental Protection",
  description:
    "EnergyEminence integrates environmental threat detection with energy infrastructure monitoring, creating a unified AI platform that safeguards critical systems while optimizing performance.",
  keywords: "AI, energy, infrastructure, monitoring, environmental, Canada, wildfire detection, predictive analytics",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Sets your current dark mode as the default!
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
