import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast"; // Importar Toaster
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
  title: "Valkirias",
  description: "Estampamos tus ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className="flex h-screen">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <Toaster /> 
      </body>
    </html>
  );
}
