import Footer from "@/components/layout/Footer";
import HomeClient from "./HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CaseMed - Platform Latihan UKMPPD Online Terbaik di Indonesia",
  description: "Persiapkan diri Anda untuk UKMPPD dengan platform latihan online terlengkap. Ribuan soal berkualitas, simulasi ujian CBT, pembahasan detail, dan tracking progress. Daftar gratis sekarang!",
  keywords: "UKMPPD, latihan UKMPPD, soal UKMPPD, simulasi UKMPPD, tryout dokter, CBT UKMPPD, persiapan ujian dokter",
  openGraph: {
    title: "CaseMed - Platform Latihan UKMPPD Online Terbaik",
    description: "Platform latihan soal UKMPPD online terlengkap dengan ribuan soal berkualitas dan pembahasan detail",
    url: '/',
    type: 'website',
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      <HomeClient />
      <Footer />
    </div>
  );
}
