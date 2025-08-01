import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Toaster } from "react-hot-toast";
import MobileBottom from "@/components/shared/MobileBottom";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ShareSpark",
  description: "A social media application using Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    >
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster
        position="top-right"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <div className="min-h-screen">
        <Navbar/>
        <main className="w-full py-8 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-5">
        <div className="lg:col-span-3">
         <Sidebar/>
          </div>
        <div className="lg:col-span-9">
        {children}
        </div>
        </div>
        </main>
        <div className="fixed bottom-0 w-full  md:hidden">
        <MobileBottom/>
        </div>
        </div>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
