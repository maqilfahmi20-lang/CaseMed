'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    },
    tap: { scale: 0.9 }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="grid md:grid-cols-4 gap-8 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="text-xl font-bold text-white mb-4"
              whileHover={{ scale: 1.05, color: "#60A5FA" }}
            >
              CaseMed
            </motion.h3>
            <motion.p 
              className="text-sm text-gray-400 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Platform tryout online terpercaya untuk persiapan ujian Anda. 
              Akses kapan saja, di mana saja.
            </motion.p>
            <div className="flex gap-3">
              <motion.a 
                href="https://www.instagram.com/mhd_ilham85/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-all"
                aria-label="Instagram"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                📷
              </motion.a>
              <motion.a 
                href="https://wa.me/6288227623957" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 transition-all"
                aria-label="WhatsApp"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                💬
              </motion.a>
              <motion.a 
                href="mailto:supportcasemed@gmail.com"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 transition-all"
                aria-label="Email"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                📧
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-white mb-4">Link Cepat</h4>
            <ul className="space-y-2 text-sm">
              <motion.li whileHover={{ x: 5, color: "#60A5FA" }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="/about" className="hover:text-white transition flex items-center gap-2">
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    →
                  </motion.span>
                  Tentang Kami
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5, color: "#60A5FA" }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="/contact" className="hover:text-white transition flex items-center gap-2">
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.2 }}
                  >
                    →
                  </motion.span>
                  Hubungi Kami
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5, color: "#60A5FA" }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="/register" className="hover:text-white transition flex items-center gap-2">
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.4 }}
                  >
                    →
                  </motion.span>
                  Daftar
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5, color: "#60A5FA" }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="/login" className="hover:text-white transition flex items-center gap-2">
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.6 }}
                  >
                    →
                  </motion.span>
                  Login
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-white mb-4">Informasi Legal</h4>
            <ul className="space-y-2 text-sm">
              <motion.li whileHover={{ x: 5, color: "#60A5FA" }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="/terms" className="hover:text-white transition flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    📄
                  </motion.span>
                  Syarat dan Ketentuan
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5, color: "#60A5FA" }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="/refund-policy" className="hover:text-white transition flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.3 }}
                  >
                    💰
                  </motion.span>
                  Kebijakan Pengembalian Dana
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5, color: "#60A5FA" }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="/privacy-policy" className="hover:text-white transition flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.6 }}
                  >
                    🔒
                  </motion.span>
                  Kebijakan Privasi
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-white mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <motion.li 
                className="flex items-start gap-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span 
                  className="text-base"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                >
                  📧
                </motion.span>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Email</div>
                  <a 
                    href="mailto:supportcasemed@gmail.com" 
                    className="hover:text-blue-400 transition"
                  >
                    supportcasemed@gmail.com
                  </a>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span 
                  className="text-base"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4 }}
                >
                  💬
                </motion.span>
                <div>
                  <div className="text-gray-400 text-xs mb-1">WhatsApp</div>
                  <a 
                    href="https://wa.me/6288227623957" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-400 transition"
                  >
                   +62 882-2762-3957
                  </a>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span 
                  className="text-base"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                >
                  📍
                </motion.span>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Alamat</div>
                  <span>Brebes, Indonesia</span>
                </div>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div 
          className="border-t border-gray-800 pt-8 pb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="text-center mb-4">
            <p className="text-sm text-gray-400 mb-3">Metode Pembayaran Aman</p>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <motion.div 
                className="bg-white rounded px-4 py-2 text-xs font-semibold text-gray-700"
                whileHover={{ scale: 1.1, y: -5, boxShadow: "0 10px 20px rgba(255,255,255,0.2)" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                💳 Kartu Kredit/Debit
              </motion.div>
              <motion.div 
                className="bg-white rounded px-4 py-2 text-xs font-semibold text-gray-700"
                whileHover={{ scale: 1.1, y: -5, boxShadow: "0 10px 20px rgba(255,255,255,0.2)" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                🏦 Transfer Bank
              </motion.div>
              <motion.div 
                className="bg-white rounded px-4 py-2 text-xs font-semibold text-gray-700"
                whileHover={{ scale: 1.1, y: -5, boxShadow: "0 10px 20px rgba(255,255,255,0.2)" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                📱 E-Wallet
              </motion.div>
              <motion.div 
                className="bg-white rounded px-4 py-2 text-xs font-semibold text-gray-700"
                whileHover={{ scale: 1.1, y: -5, boxShadow: "0 10px 20px rgba(255,255,255,0.2)" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                🛒 Virtual Account
              </motion.div>
            </div>
            <motion.p 
              className="text-xs text-gray-500 mt-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              Powered by <motion.span 
                className="font-semibold text-blue-400"
                whileHover={{ scale: 1.1, color: "#60A5FA" }}
              >
                Midtrans
              </motion.span> - Payment Gateway Tersertifikasi
            </motion.p>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-800 pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <motion.p
              whileHover={{ scale: 1.05, color: "#60A5FA" }}
            >
              © {currentYear} CaseMed. All rights reserved.
            </motion.p>
            <motion.p 
              className="text-xs flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              Made with <motion.span
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                ❤️
              </motion.span> for Indonesian Students
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
