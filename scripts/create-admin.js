const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔍 Checking existing admin...');
    
    // Cek apakah admin sudah ada
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@tryout.com' }
    });

    if (existingAdmin) {
      console.log('❌ Admin sudah ada dengan email: admin@tryout.com');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nama:', existingAdmin.nama);
      console.log('🔑 Role:', existingAdmin.role);
      return;
    }

    console.log('📝 Creating admin user...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Buat admin user
    const admin = await prisma.user.create({
      data: {
        nama: 'Administrator',
        email: 'admin@tryout.com',
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Admin berhasil dibuat!');
    console.log('📧 Email: admin@tryout.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Nama:', admin.nama);
    console.log('🆔 ID:', admin.id);
    console.log('\n🚀 Anda bisa login sekarang di: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Tip: Pastikan MySQL server sudah running dan DATABASE_URL di .env benar');
    } else if (error.code === 'P2002') {
      console.log('\n💡 Tip: Email admin@tryout.com sudah terdaftar');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
