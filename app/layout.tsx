import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Peculiar - Share Your Unique Perspective",
  description: "A unique social media platform combining text, voice, and video sharing",
  keywords: "social media, voice, threads, community",
  authors: [{ name: "Peculiar Team" }],
  openGraph: {
    title: "Peculiar",
    description: "Share Your Unique Perspective",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peculiar",
    description: "Share Your Unique Perspective",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
