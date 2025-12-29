import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:opacity-80">
              CaseMed
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              ← Kembali
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Hubungi Kami</h1>
            <p className="text-lg text-gray-600">
              Ada pertanyaan? Tim kami siap membantu Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Contact Cards */}
            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📧</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Untuk pertanyaan umum dan dukungan teknis
                  </p>
                  <a 
                    href="mailto:supportcasemed@gmail.com" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    supportcasemed@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">WhatsApp</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Chat langsung dengan tim support
                  </p>
                  <a 
                    href="https://wa.me/+6288227623957" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    +62 882-2762-3957
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">Alamat Kantor</h3>
                  <p className="text-gray-600 text-sm">
                    BanjarHarjo<br />
                    Brebes 52265<br />
                    Jawa Tengah, Indonesia
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⏰</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">Jam Operasional</h3>
                  <p className="text-gray-600 text-sm">
                    <strong>Senin - Jumat:</strong> 09:00 - 17:00 WIB<br />
                    <strong>Sabtu:</strong> 09:00 - 14:00 WIB<br />
                    <strong>Minggu & Libur:</strong> Tutup
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pertanyaan yang Sering Diajukan</h2>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Bagaimana cara membeli paket tryout?
                </h3>
                <p className="text-gray-600 text-sm">
                  Login ke akun Anda → Pilih paket yang diinginkan → Klik "Beli Paket" → 
                  Pilih metode pembayaran → Selesaikan pembayaran. Akses akan langsung aktif setelah 
                  pembayaran berhasil.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Berapa lama waktu mengerjakan ujian?
                </h3>
                <p className="text-gray-600 text-sm">
                  Waktu ujian bervariasi berdasarkan jenis paket: Latihan Soal (30 menit), Simulasi UKMPPD (200 menit). 
                  Timer akan berjalan otomatis saat Anda mulai ujian dan akan auto-submit jika waktu habis.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Apakah saya bisa mengerjakan ujian lebih dari sekali?
                </h3>
                <p className="text-gray-600 text-sm">
                  Ya, setiap paket memiliki batas maksimal percobaan yang sudah ditentukan (biasanya 
                  1-3 kali). Anda dapat melihat sisa percobaan di halaman detail paket.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Bagaimana cara melihat pembahasan soal?
                </h3>
                <p className="text-gray-600 text-sm">
                  Setelah menyelesaikan ujian, Anda dapat melihat hasil nilai. Klik tombol 
                  "Pembahasan" untuk melihat jawaban yang benar beserta penjelasan lengkap untuk 
                  setiap soal.
                </p>
              </div>

              <div className="pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Bagaimana jika saya lupa password?
                </h3>
                <p className="text-gray-600 text-sm">
                  Hubungi tim support kami melalui email atau WhatsApp dengan menyertakan email 
                  yang terdaftar. Kami akan membantu proses reset password Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Business Inquiries */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Kerja Sama & Partnership</h2>
            <p className="text-blue-100 mb-6">
              Tertarik untuk bekerja sama dengan kami? Hubungi tim business development kami untuk 
              diskusi lebih lanjut mengenai partnership, sponsorship, atau kolaborasi lainnya.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="mailto:partnership@sistemtryout.com" 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
              >
                📧 Email Partnership
              </a>
              <a 
                href="https://wa.me/6281234567890?text=Halo, saya tertarik untuk bekerja sama" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition text-center"
              >
                💬 WhatsApp Business
              </a>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Waktu Respons</h3>
                <p className="text-sm text-yellow-700">
                  Tim support kami akan merespons pertanyaan Anda dalam <strong>1x24 jam</strong> di 
                  hari kerja. Untuk pertanyaan urgent terkait pembayaran atau akses, kami usahakan 
                  respons lebih cepat melalui WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3">Informasi Lebih Lanjut:</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Tentang Kami
              </Link>
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Syarat dan Ketentuan
              </Link>
              <Link href="/refund-policy" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Kebijakan Pengembalian Dana
              </Link>
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
