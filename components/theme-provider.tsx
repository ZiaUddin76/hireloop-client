"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      // next-themes renders an inline <script> to set the theme class before
      // paint. React warns when client rendering produces an executable
      // <script>, so mark it non-executable (`text/plain`) on the client only.
      // The server keeps `text/javascript` so the script still runs during
      // HTML parsing before hydration.
      scriptProps={{
        type: typeof window === "undefined" ? "text/javascript" : "text/plain",
      }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }
