import { Geist } from "next/font/google"
import { Manrope } from "next/font/google"
import { Space_Mono } from "next/font/google"

import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        geist.variable,
        manrope.variable,
        spaceMono.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
