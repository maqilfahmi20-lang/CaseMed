'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HomeClient() {
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
    <>
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
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div className="text-white" variants={itemVariants}>
              <motion.div 
                className="inline-block mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                  ✨ Platform Latihan UKMPPD Terbaik
                </span>
              </motion.div>
              
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Lulus UKMPPD
                <span className="block text-yellow-300">Jadi Lebih Mudah</span>
              </h2>
              
              <p className="text-xl text-white/90 mb-8">
                Platform latihan soal UKMPPD online terlengkap dengan ribuan soal berkualitas, 
                pembahasan detail, dan simulasi ujian yang mirip dengan ujian sebenarnya.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg w-full sm:w-auto hover:bg-yellow-300 transition shadow-lg"
                  >
                    🚀 Daftar Gratis Sekarang
                  </motion.button>
                </Link>
                
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg w-full sm:w-auto border-2 border-white/30 hover:bg-white/30 transition"
                  >
                    📖 Pelajari Lebih Lanjut
                  </motion.button>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-sm text-white/70">Soal Berkualitas</div>
                </div>
                <div className="h-12 w-px bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-white/70">Pengguna Aktif</div>
                </div>
                <div className="h-12 w-px bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-sm text-white/70">Tingkat Kepuasan</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Floating Cards */}
            <motion.div className="relative" variants={itemVariants}>
              <motion.div
                animate={floatingAnimation}
                className="relative z-10"
              >
                <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">📚</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-xl">Ribuan Soal UKMPPD</h3>
                      <p className="text-gray-600">Update setiap bulan</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>Soal sesuai blueprint UKMPPD</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>Pembahasan lengkap & detail</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>Simulasi CBT seperti asli</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -right-4 z-0"
              >
                <div className="bg-yellow-400 rounded-2xl shadow-xl p-6 transform -rotate-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <div className="font-bold text-gray-800">Progress Tracking</div>
                      <div className="text-sm text-gray-600">Monitor kemajuan Anda</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-4 z-0"
              >
                <div className="bg-green-400 rounded-2xl shadow-xl p-6 transform rotate-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">💡</div>
                    <div>
                      <div className="font-bold text-gray-800">Pembahasan Detail</div>
                      <div className="text-sm text-gray-600">Pahami setiap konsep</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Kenapa Memilih CaseMed?
              </h2>
              <p className="text-xl text-gray-600">
                Platform yang dirancang khusus untuk kesuksesan UKMPPD Anda
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "📝",
                  title: "Soal Berkualitas Tinggi",
                  description: "Ribuan soal yang disusun sesuai blueprint UKMPPD terbaru dan diupdate secara berkala"
                },
                {
                  icon: "🎯",
                  title: "Simulasi Ujian CBT",
                  description: "Pengalaman ujian yang mirip dengan UKMPPD sebenarnya untuk mempersiapkan mental"
                },
                {
                  icon: "💡",
                  title: "Pembahasan Lengkap",
                  description: "Setiap soal dilengkapi pembahasan detail untuk membantu pemahaman konsep"
                },
                {
                  icon: "📊",
                  title: "Tracking Progress",
                  description: "Monitor perkembangan belajar Anda dengan statistik dan analisis mendalam"
                },
                {
                  icon: "🔄",
                  title: "Unlimited Attempt",
                  description: "Kerjakan soal berkali-kali untuk meningkatkan pemahaman tanpa batas"
                },
                {
                  icon: "💎",
                  title: "Harga Terjangkau",
                  description: "Akses premium dengan harga yang sangat terjangkau untuk mahasiswa kedokteran"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 transition-all"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Section - Premium Package */}
      <div className="bg-gradient-to-b from-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* Section Header */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                💎 PAKET PREMIUM
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Investasi Terbaik untuk Masa Depan Anda
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Akses unlimited ke semua fitur premium dengan harga yang sangat terjangkau
              </p>
            </motion.div>

            {/* Main Pricing Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-200"
            >
              {/* Header dengan Harga */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-4 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-3 sm:px-6 py-1 sm:py-2 rounded-bl-2xl font-bold text-xs sm:text-sm shadow-lg">
                  🔥 BEST SELLER
                </div>
                <div className="relative z-10">
                  <div className="text-white/90 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">
                    Paket Berlangganan Premium
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
                    <div className="text-white/60 text-2xl sm:text-3xl font-bold line-through">
                      Rp 900.000
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                      HEMAT 94%
                    </div>
                  </div>
                  <div className="text-white mb-2">
                    <span className="text-4xl sm:text-6xl md:text-7xl font-bold">Rp 55.000</span>
                  </div>
                  <div className="text-white/90 text-base sm:text-xl">
                    per bulan • unlimited access
                  </div>
                  <div className="mt-6">
                    <Link href="/register">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-400 text-purple-900 px-6 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-yellow-300 transition shadow-xl w-full sm:w-auto"
                      >
                        🚀 Mulai Berlangganan Sekarang
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="p-4 sm:p-8 md:p-12">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                  ✨ Yang Anda Dapatkan:
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-6">
                  {[
                    {
                      icon: "📚",
                      title: "Akses Unlimited",
                      desc: "Semua paket simulasi & latihan (51+ paket)"
                    },
                    {
                      icon: "🎯",
                      title: "1000+ Soal Premium",
                      desc: "Bank soal lengkap sesuai blueprint UKMPPD"
                    },
                    {
                      icon: "💡",
                      title: "Pembahasan Detail",
                      desc: "Penjelasan lengkap untuk setiap jawaban"
                    },
                    {
                      icon: "🔄",
                      title: "Update Rutin",
                      desc: "Soal baru ditambahkan setiap minggu"
                    },
                    {
                      icon: "📊",
                      title: "Progress Tracking",
                      desc: "Monitor perkembangan belajar Anda"
                    },
                    {
                      icon: "⚡",
                      title: "Simulasi CBT",
                      desc: "Pengalaman ujian seperti UKMPPD asli"
                    },
                    {
                      icon: "🏆",
                      title: "Unlimited Attempts",
                      desc: "Kerjakan soal tanpa batas percobaan"
                    },
                    {
                      icon: "💳",
                      title: "Pembayaran Mudah",
                      desc: "QRIS, Transfer Bank, E-Wallet via Midtrans"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100"
                    >
                      <div className="text-2xl sm:text-3xl flex-shrink-0">{feature.icon}</div>
                      <div>
                        <div className="font-bold text-gray-800 mb-1 text-sm sm:text-base">{feature.title}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{feature.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Value Comparison */}
                <div className="mt-6 sm:mt-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border-2 border-purple-200">
                  <div className="text-center mb-4">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">💰 Bandingkan Harga</h4>
                    <p className="text-sm sm:text-base text-gray-600">Lebih hemat dengan berlangganan!</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white rounded-xl p-4 sm:p-6 text-center border border-red-200">
                      <div className="text-red-600 font-semibold mb-2 text-sm sm:text-base">❌ Beli Satuan</div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-800 line-through mb-2">
                        Rp 900.000
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Untuk 51 paket</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 sm:p-6 text-center text-white border-4 border-yellow-400 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-purple-900 px-3 sm:px-4 py-1 rounded-full text-xs font-bold">
                        RECOMMENDED
                      </div>
                      <div className="font-semibold mb-2 text-sm sm:text-base">✅ Berlangganan</div>
                      <div className="text-3xl sm:text-5xl font-bold mb-2">
                        Rp 55.000
                      </div>
                      <div className="text-xs sm:text-sm">Akses semua paket selama sebulan</div>
                    </div>
                  </div>
                  <div className="text-center mt-6">
                    <div className="inline-block bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold">
                      🎉 Hemat Rp 845.000 (94%)
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-6 sm:mt-8 text-center">
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">💳 Metode Pembayaran Aman via Midtrans:</p>
                  <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
                    <div className="bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg border shadow-sm">
                      <span className="font-semibold text-gray-700 text-xs sm:text-sm">QRIS</span>
                    </div>
                    <div className="bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg border shadow-sm">
                      <span className="font-semibold text-gray-700 text-xs sm:text-sm">Transfer Bank</span>
                    </div>
                    <div className="bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg border shadow-sm">
                      <span className="font-semibold text-gray-700 text-xs sm:text-sm">GoPay</span>
                    </div>
                    <div className="bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg border shadow-sm">
                      <span className="font-semibold text-gray-700 text-xs sm:text-sm">OVO</span>
                    </div>
                    <div className="bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg border shadow-sm">
                      <span className="font-semibold text-gray-700 text-xs sm:text-sm">DANA</span>
                    </div>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full border border-blue-200">
                    <span className="text-2xl">🛡️</span>
                    <span className="font-semibold">100% Aman & Terpercaya</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial / Trust Badge */}
            <motion.div variants={itemVariants} className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-lg border border-gray-200">
                <span className="text-3xl">⭐</span>
                <div className="text-left">
                  <div className="font-bold text-gray-800">Rating 4.9/5.0</div>
                  <div className="text-sm text-gray-600">dari 500+ pengguna aktif</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Siap Mulai Persiapan UKMPPD?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Bergabunglah dengan ratusan mahasiswa kedokteran yang sudah mempersiapkan diri dengan CaseMed
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="bg-yellow-400 text-blue-900 px-12 py-5 rounded-xl font-bold text-xl hover:bg-yellow-300 transition shadow-2xl"
              >
                {isHovering ? "🚀 Yuk, Daftar Sekarang!" : "🎓 Daftar Gratis Sekarang"}
              </motion.button>
            </Link>
            <p className="mt-6 text-white/70">
              Gratis untuk memulai • Tanpa kartu kredit • Akses instan
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
