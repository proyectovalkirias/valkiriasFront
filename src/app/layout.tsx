import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SidebarMini from "@/components/SidebarMini";

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
        {/* Sidebar normal: visible solo en pantallas medianas o más grandes */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Contenedor global para Toastify */}
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Contenedor global para Hot Toast */}
        <Toaster />

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto">{children}</main>

        {/* SidebarMini: visible solo en pantallas pequeñas */}
        <div className="block md:hidden">
          <SidebarMini />
        </div>
      </body>
    </html>
  );
}
