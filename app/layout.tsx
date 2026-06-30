import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import DashboardShell from "../components/DashboardShell";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PUC Student Portal",
  description: "Your personal academic dashboard — courses, grades, schedule, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="antialiased min-h-screen bg-space-950 text-foreground">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
