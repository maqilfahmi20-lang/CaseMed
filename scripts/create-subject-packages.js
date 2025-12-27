const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSubjectPackages() {
  try {
    console.log('🚀 Membuat paket latihan berdasarkan jenis soal...\n');

    const subjects = [
      { jenis: 'matematika', nama: 'Latihan Matematika', emoji: '🔢' },
      { jenis: 'fisika', nama: 'Latihan Fisika', emoji: '⚛️' },
      { jenis: 'kimia', nama: 'Latihan Kimia', emoji: '🧪' },
      { jenis: 'bahasa_indonesia', nama: 'Latihan Bahasa Indonesia', emoji: '📖' },
      { jenis: 'bahasa_inggris', nama: 'Latihan Bahasa Inggris', emoji: '🌍' },
    ];

    for (const subject of subjects) {
      // Check if package already exists
      const existing = await prisma.package.findFirst({
        where: { nama: subject.nama }
      });

      if (existing) {
        console.log(`⚠️  Paket "${subject.nama}" sudah ada, skip...`);
        continue;
      }

      // Create package
      const pkg = await prisma.package.create({
        data: {
          nama: subject.nama,
          tipe_paket: 'latihan',
          total_soal: 20,
          max_attempt: 3,
          is_free: true,
          harga: 0,
          is_active: true,
        }
      });

      console.log(`${subject.emoji} Paket "${subject.nama}" berhasil dibuat (ID: ${pkg.id})`);

      // Get questions for this subject
      const questions = await prisma.question.findMany({
        where: {
          kategori: 'latihan',
          jenis_soal: subject.jenis
        },
        take: 20,
        orderBy: { createdAt: 'desc' }
      });

      if (questions.length > 0) {
        // Assign questions to package
        await prisma.packageQuestion.createMany({
          data: questions.map((q) => ({
            package_id: pkg.id,
            question_id: q.id,
          }))
        });

        console.log(`   ✅ ${questions.length} soal ditambahkan ke paket`);
      } else {
        console.log(`   ⚠️  Belum ada soal ${subject.jenis}, paket kosong`);
      }
    }

    console.log('\n✨ Selesai! Paket latihan berdasarkan jenis soal berhasil dibuat.');
    console.log('💡 Admin bisa menambahkan soal ke database, lalu jalankan script ini lagi untuk assign soal ke paket.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSubjectPackages();
