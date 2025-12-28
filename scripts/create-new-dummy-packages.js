const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const KATEGORI_UKMPPD = [
  "Basic Medical Science",
  "Etika, Hukum, dan Profesionalisme Kedokteran",
  "Sistem Saraf dan Perilaku",
  "Sistem Kardiovaskular dan Hematologi",
  "Sistem Respirasi",
  "Sistem Gastrointestinal dan Hepatobilier",
  "Sistem Ginjal dan Saluran Kemih",
  "Sistem Endokrin dan Metabolik",
  "Sistem Reproduksi dan Kesehatan Ibu dan Anak",
  "Sistem Muskuloskeletal dan Reumatologi",
  "Sistem Integumen",
  "Penyakit Infeksi dan Penyakit Tropis",
  "Ilmu Penyakit Dalam Terpadu",
  "Bedah Terpadu dan Kegawatdaruratan",
  "Kedokteran Keluarga dan Komunitas",
  "Gawat Darurat dan Patient Safety"
];

async function main() {
  console.log('🚀 Membuat dummy packages untuk Simulasi & Latihan UKMPPD...\n');

  // ============== SIMULASI UKMPPD ==============
  console.log('📋 Membuat Simulasi UKMPPD packages per kategori...');
  
  const simulasiPackages = [];

  // 1 paket gratis dari kategori pertama
  simulasiPackages.push({
    nama: 'Simulasi Basic Medical Science (GRATIS)',
    tipe_paket: 'simulasi',
    kategori: KATEGORI_UKMPPD[0],
    total_soal: 50,
    max_attempt: 3,
    is_free: true,
    harga: 0,
    is_active: true,
  });

  // Paket berbayar untuk semua 16 kategori
  const simulasiKategoriSamples = [
    { kategori: KATEGORI_UKMPPD[0], nama: 'Simulasi Basic Medical Science Lanjutan', soal: 60, harga: 35000 },
    { kategori: KATEGORI_UKMPPD[1], nama: 'Simulasi Etika, Hukum, dan Profesionalisme', soal: 40, harga: 30000 },
    { kategori: KATEGORI_UKMPPD[2], nama: 'Simulasi Sistem Saraf dan Perilaku', soal: 70, harga: 40000 },
    { kategori: KATEGORI_UKMPPD[3], nama: 'Simulasi Sistem Kardiovaskular dan Hematologi', soal: 90, harga: 45000 },
    { kategori: KATEGORI_UKMPPD[4], nama: 'Simulasi Sistem Respirasi', soal: 60, harga: 35000 },
    { kategori: KATEGORI_UKMPPD[5], nama: 'Simulasi Sistem Gastrointestinal dan Hepatobilier', soal: 80, harga: 40000 },
    { kategori: KATEGORI_UKMPPD[6], nama: 'Simulasi Sistem Ginjal dan Saluran Kemih', soal: 55, harga: 35000 },
    { kategori: KATEGORI_UKMPPD[7], nama: 'Simulasi Sistem Endokrin dan Metabolik', soal: 65, harga: 40000 },
    { kategori: KATEGORI_UKMPPD[8], nama: 'Simulasi Sistem Reproduksi dan Kesehatan Ibu dan Anak', soal: 60, harga: 35000 },
    { kategori: KATEGORI_UKMPPD[9], nama: 'Simulasi Sistem Muskuloskeletal dan Reumatologi', soal: 55, harga: 35000 },
    { kategori: KATEGORI_UKMPPD[10], nama: 'Simulasi Sistem Integumen', soal: 50, harga: 30000 },
    { kategori: KATEGORI_UKMPPD[11], nama: 'Simulasi Penyakit Infeksi dan Penyakit Tropis', soal: 75, harga: 40000 },
    { kategori: KATEGORI_UKMPPD[12], nama: 'Simulasi Ilmu Penyakit Dalam Terpadu', soal: 100, harga: 50000 },
    { kategori: KATEGORI_UKMPPD[13], nama: 'Simulasi Bedah Terpadu dan Kegawatdaruratan', soal: 80, harga: 45000 },
    { kategori: KATEGORI_UKMPPD[14], nama: 'Simulasi Kedokteran Keluarga dan Komunitas', soal: 60, harga: 35000 },
    { kategori: KATEGORI_UKMPPD[15], nama: 'Simulasi Gawat Darurat dan Patient Safety', soal: 70, harga: 40000 },
  ];

  for (const sample of simulasiKategoriSamples) {
    simulasiPackages.push({
      nama: sample.nama,
      tipe_paket: 'simulasi',
      kategori: sample.kategori,
      total_soal: sample.soal,
      max_attempt: 3,
      is_free: false,
      harga: sample.harga,
      is_active: true,
    });
  }

  for (const pkg of simulasiPackages) {
    const created = await prisma.package.create({ data: pkg });
    console.log(`✅ ${created.nama} - ${created.is_free ? 'GRATIS' : `Rp ${created.harga.toLocaleString()}`}`);
  }

  // ============== LATIHAN UKMPPD ==============
  console.log('\n📚 Membuat Latihan UKMPPD packages per kategori...');
  
  const latihanPackages = [];

  // 2 paket gratis dari kategori berbeda
  latihanPackages.push({
    nama: 'Latihan Basic Medical Science (GRATIS)',
    tipe_paket: 'latihan',
    kategori: KATEGORI_UKMPPD[0], // Basic Medical Science
    total_soal: 50,
    max_attempt: 999,
    is_free: true,
    harga: 0,
    is_active: true,
  });

  latihanPackages.push({
    nama: 'Latihan Sistem Kardiovaskular dan Hematologi (GRATIS)',
    tipe_paket: 'latihan',
    kategori: KATEGORI_UKMPPD[3], // Sistem Kardiovaskular dan Hematologi
    total_soal: 40,
    max_attempt: 999,
    is_free: true,
    harga: 0,
    is_active: true,
  });

  // Paket berbayar untuk kategori lainnya (1-2 paket per kategori)
  const paidKategoriSamples = [
    { kategori: KATEGORI_UKMPPD[0], nama: 'Latihan Basic Medical Science Lanjutan', soal: 75, harga: 30000 },
    { kategori: KATEGORI_UKMPPD[1], nama: 'Latihan Etika, Hukum, dan Profesionalisme', soal: 30, harga: 25000 },
    { kategori: KATEGORI_UKMPPD[2], nama: 'Latihan Sistem Saraf dan Perilaku', soal: 60, harga: 35000 },
    { kategori: KATEGORI_UKMPPD[3], nama: 'Latihan Sistem Kardiovaskular dan Hematologi Lanjutan', soal: 80, harga: 40000 },
    { kategori: KATEGORI_UKMPPD[4], nama: 'Latihan Sistem Respirasi', soal: 50, harga: 30000 },
    { kategori: KATEGORI_UKMPPD[5], nama: 'Latihan Sistem Gastrointestinal dan Hepatobilier', soal: 70, harga: 35000 },
    { kategori: KATEGORI_UKMPPD[6], nama: 'Latihan Sistem Ginjal dan Saluran Kemih', soal: 45, harga: 30000 },
    { kategori: KATEGORI_UKMPPD[7], nama: 'Latihan Sistem Endokrin dan Metabolik', soal: 55, harga: 35000 },
    { kategori: KATEGORI_UKMPPD[8], nama: 'Latihan Sistem Reproduksi dan Kesehatan Ibu dan Anak', soal: 50, harga: 30000 },
    { kategori: KATEGORI_UKMPPD[9], nama: 'Latihan Sistem Muskuloskeletal dan Reumatologi', soal: 45, harga: 30000 },
    { kategori: KATEGORI_UKMPPD[10], nama: 'Latihan Sistem Integumen', soal: 40, harga: 25000 },
    { kategori: KATEGORI_UKMPPD[11], nama: 'Latihan Penyakit Infeksi dan Penyakit Tropis', soal: 65, harga: 35000 },
    { kategori: KATEGORI_UKMPPD[12], nama: 'Latihan Ilmu Penyakit Dalam Terpadu', soal: 90, harga: 45000 },
    { kategori: KATEGORI_UKMPPD[13], nama: 'Latihan Bedah Terpadu dan Kegawatdaruratan', soal: 70, harga: 40000 },
    { kategori: KATEGORI_UKMPPD[14], nama: 'Latihan Kedokteran Keluarga dan Komunitas', soal: 50, harga: 30000 },
    { kategori: KATEGORI_UKMPPD[15], nama: 'Latihan Gawat Darurat dan Patient Safety', soal: 60, harga: 35000 },
  ];

  for (const sample of paidKategoriSamples) {
    latihanPackages.push({
      nama: sample.nama,
      tipe_paket: 'latihan',
      kategori: sample.kategori,
      total_soal: sample.soal,
      max_attempt: 5,
      is_free: false,
      harga: sample.harga,
      is_active: true,
    });
  }

  for (const pkg of latihanPackages) {
    const created = await prisma.package.create({ data: pkg });
    console.log(`✅ ${created.nama} - ${created.is_free ? 'GRATIS' : `Rp ${created.harga.toLocaleString()}`}`);
  }

  console.log('\n🎉 Selesai! Total packages dibuat:');
  console.log(`   - Simulasi UKMPPD per Kategori: ${simulasiPackages.length} paket (1 gratis)`);
  console.log(`   - Latihan UKMPPD per Kategori: ${latihanPackages.length} paket (2 gratis)`);
  console.log(`   - Total: ${simulasiPackages.length + latihanPackages.length} paket`);
  console.log(`   - 16 Kategori Sistem UKMPPD\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
