import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { BetSlipProvider } from "@/contexts/BetSlipContext";
import { AdminProvider } from "@/contexts/AdminContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Betting Platform",
  description: "A modern sports betting platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 dark:text-gray-100`}
      >
        <AuthProvider>
          <AdminProvider>
            <WalletProvider>
              <BetSlipProvider>
                {children}
              </BetSlipProvider>
            </WalletProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
