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
