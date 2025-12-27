import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaseMed - Platform Latihan UKMPPD",
  description: "Platform latihan soal UKMPPD terbaik untuk persiapan ujian dokter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
