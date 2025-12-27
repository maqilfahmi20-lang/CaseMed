const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDummyPackages() {
  try {
    console.log('🔍 Checking existing packages...');
    
    const existingPackages = await prisma.package.count();
    
    if (existingPackages > 0) {
      console.log(`✅ Sudah ada ${existingPackages} paket di database`);
      return;
    }

    console.log('📦 Creating dummy packages...');

    // Create 2 free packages
    const latihan1 = await prisma.package.create({
      data: {
        nama: 'Latihan Dasar - Paket 1',
        tipe_paket: 'latihan',
        total_soal: 20,
        harga: 0,
        is_free: true,
        max_attempt: 3,
        is_active: true,
      }
    });

    const latihan2 = await prisma.package.create({
      data: {
        nama: 'Latihan Lanjutan - Paket 2',
        tipe_paket: 'latihan',
        total_soal: 20,
        harga: 0,
        is_free: true,
        max_attempt: 2,
        is_active: true,
      }
    });

    // Create 2 UKMPPD packages (1 free, 1 paid)
    const ukmppd1 = await prisma.package.create({
      data: {
        nama: 'UKMPPD Simulasi Free',
        tipe_paket: 'ukmppd',
        total_soal: 150,
        harga: 0,
        is_free: true,
        max_attempt: 1,
        is_active: true,
      }
    });

    const ukmppd2 = await prisma.package.create({
      data: {
        nama: 'UKMPPD Simulasi Premium',
        tipe_paket: 'ukmppd',
        total_soal: 150,
        harga: 50000,
        is_free: false,
        max_attempt: 5,
        is_active: true,
      }
    });

    console.log('✅ Berhasil membuat 4 paket dummy!');
    console.log('📋 Paket yang dibuat:');
    console.log(`  1. ${latihan1.nama} - GRATIS (max 3x)`);
    console.log(`  2. ${latihan2.nama} - GRATIS (max 2x)`);
    console.log(`  3. ${ukmppd1.nama} - GRATIS (max 1x)`);
    console.log(`  4. ${ukmppd2.nama} - Rp 50.000 (max 5x)`);
    console.log('\n🚀 Refresh dashboard untuk melihat paket!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createDummyPackages();
