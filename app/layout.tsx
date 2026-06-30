import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import DashboardShell from "../components/DashboardShell";
import SmoothScroll from "../components/SmoothScroll";
import { getServerSession } from "../lib/server-session";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getServerSession();

  return (
    <html
      lang="en"
      className={`${spaceMono.variable}`}
    >
      <body className="antialiased min-h-screen bg-space-950 text-foreground">
        <SmoothScroll>
          <DashboardShell user={user}>{children}</DashboardShell>
        </SmoothScroll>
      </body>
    </html>
  );
}
