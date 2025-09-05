import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/contexts/theme-context";
import { APP_CONFIG } from "@/lib/constants";
import { TransactionModalProvider } from "@/contexts/transaction-modal-context";
import { TransactionModal } from "@/components/transactions/transaction-modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider>
            <TransactionModalProvider>
              {/* Global scroll container to ensure all routes can scroll on mobile */}
              <div className="min-h-[100dvh] bg-gray-50 dark:bg-slate-950 transition-colors duration-200 flex flex-col overflow-y-auto">
                {children}
              </div>
              {/* Global transaction modal */}
              <TransactionModal />
            </TransactionModalProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
