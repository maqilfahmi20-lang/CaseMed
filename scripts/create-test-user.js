const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔍 Checking existing test user...');
    
    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email: 'user@test.com' }
    });

    if (existingUser) {
      console.log('❌ User test sudah ada dengan email: user@test.com');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Nama:', existingUser.nama);
      console.log('🔑 Role:', existingUser.role);
      return;
    }

    console.log('📝 Creating test user...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('user123', 10);
    
    // Buat test user
    const user = await prisma.user.create({
      data: {
        nama: 'Test User',
        email: 'user@test.com',
        password: hashedPassword,
        role: 'user'
      }
    });

    console.log('✅ User test berhasil dibuat!');
    console.log('📧 Email: user@test.com');
    console.log('🔑 Password: user123');
    console.log('👤 Nama:', user.nama);
    console.log('🆔 ID:', user.id);
    console.log('\n🚀 Anda bisa login sekarang di: http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Tip: Pastikan MySQL server sudah running dan DATABASE_URL di .env benar');
    } else if (error.code === 'P2002') {
      console.log('\n💡 Tip: Email user@test.com sudah terdaftar');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
