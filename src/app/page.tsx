'use client';

import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="bg-white/10 backdrop-blur-sm border-b border-white/20"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.h1 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-white cursor-pointer"
            >
              CaseMed
            </motion.h1>
            <div className="flex gap-3">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold transition"
                >
                  Masuk
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold border border-white/30 transition"
                >
                  Daftar
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div 
        className="container mx-auto px-4 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div animate={floatingAnimation}>
            <motion.h2 
              variants={itemVariants}
              className="text-5xl font-bold text-white mb-6"
            >
              Platform Latihan UKMPPD 🩺
            </motion.h2>
          </motion.div>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-white/90 mb-8"
          >
            Persiapkan diri untuk UKMPPD dengan ribuan soal latihan berkualitas
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/register">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition"
              >
                Mulai Sekarang 🚀
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 cursor-pointer"
          >
            <motion.div 
              className="text-4xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              📚
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">Bank Soal Lengkap</h3>
            <p className="text-white/80">
              Ribuan soal latihan dan simulasi UKMPPD
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 cursor-pointer"
          >
            <motion.div 
              className="text-4xl mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              📊
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">Analisis Nilai</h3>
            <p className="text-white/80">
              Lihat progress dan analisis hasil latihanmu secara detail
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 cursor-pointer"
          >
            <motion.div 
              className="text-4xl mb-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⚡
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">Latihan Harian</h3>
            <p className="text-white/80">
              Tingkatkan kemampuanmu dengan latihan harian yang tersedia setiap hari
            </p>
          </motion.div>
        </motion.div>

        {/* Pricing Section - Subscription Offer */}
        <motion.div 
          className="mt-20 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">💎 Paket Langganan Premium</h2>
            <p className="text-xl text-white/90">Akses unlimited ke semua soal latihan & simulasi UKMPPD</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
              <div className="text-white/90 text-sm font-semibold uppercase tracking-wide mb-2">Paket Berlangganan</div>
              <div className="text-5xl font-bold text-white mb-2">Rp 55.000</div>
              <div className="text-white/80 text-lg">per bulan</div>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl">✓</div>
                  <div>
                    <div className="font-semibold text-gray-800">Akses Unlimited</div>
                    <div className="text-sm text-gray-600">Semua paket latihan & simulasi (51 paket)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl">✓</div>
                  <div>
                    <div className="font-semibold text-gray-800">1000+ Soal Premium</div>
                    <div className="text-sm text-gray-600">Bank soal lengkap sesuai blueprint UKMPPD</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl">✓</div>
                  <div>
                    <div className="font-semibold text-gray-800">Pembahasan Detail</div>
                    <div className="text-sm text-gray-600">Penjelasan lengkap setiap jawaban</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl">✓</div>
                  <div>
                    <div className="font-semibold text-gray-800">Update Berkala</div>
                    <div className="text-sm text-gray-600">Soal baru ditambahkan setiap minggu</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl">✓</div>
                  <div>
                    <div className="font-semibold text-gray-800">Progress Tracking</div>
                    <div className="text-sm text-gray-600">Monitor perkembangan belajar kamu</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Hemat hingga</div>
                  <div className="text-2xl font-bold text-blue-600">94%</div>
                  <div className="text-xs text-gray-500">dibanding beli paket satuan</div>
                </div>
              </div>

              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition"
                >
                  Daftar & Berlangganan Sekarang →
                </motion.button>
              </Link>

              <p className="text-center text-sm text-gray-500 mt-4">
                🔒 Pembayaran aman via Midtrans • QRIS, Transfer Bank, E-Wallet
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonial / Trust Badge */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
            <span className="text-2xl">🎓</span>
            <span className="text-white font-semibold">Dipercaya oleh ribuan mahasiswa kedokteran se-Indonesia</span>
          </div>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}
