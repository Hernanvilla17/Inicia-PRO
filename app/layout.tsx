import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import { Sidebar, MobileNav } from "@/components/sidebar";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InicIA Pro — Herramientas de IA para profesionales",
  description:
    "Plataforma premium de herramientas de IA de Inicia con IA. Mejora tus prompts, accede a guías y domina la inteligencia artificial.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${poppins.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <Sidebar />
        <MobileNav />
        <main className="min-h-screen pt-14 lg:ml-[240px] lg:pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
