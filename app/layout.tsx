import type { Metadata, Viewport } from "next"
import { DM_Sans, DM_Serif_Display, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "FORMA",
  description: "Construcción de identidad a través de hábitos",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={cn("dark font-sans", inter.variable)}>
      <body className={`${dmSans.variable} ${dmSerifDisplay.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
