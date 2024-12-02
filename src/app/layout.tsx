import type { Metadata } from "next";
import { Inter, } from "next/font/google";
import "./globals.css";

// Fonte Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", 
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head />
      <body className={`${inter.variable} bg-black`}>
        {children}
      </body>
    </html>
  );
}

