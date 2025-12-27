import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Security: Check secret key
    const { secret } = await request.json();
    
    if (secret !== process.env.AUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check existing packages
    const existingCount = await prisma.paket.count();
    
    if (existingCount > 0) {
      return NextResponse.json({ 
        message: `Already has ${existingCount} packages in database`,
        skip: true
      });
    }

    // Create dummy packages
    const packages = await prisma.paket.createMany({
      data: [
        {
          nama: 'Latihan Dasar - Paket 1',
          deskripsi: 'Paket latihan dasar untuk pemula dengan 20 soal pilihan ganda',
          harga: 0,
          durasi: 30,
          jumlahSoal: 20,
          maxAttempts: 3,
          isActive: true
        },
        {
          nama: 'Latihan Lanjutan - Paket 2',
          deskripsi: 'Paket latihan lanjutan dengan 30 soal level menengah',
          harga: 0,
          durasi: 45,
          jumlahSoal: 30,
          maxAttempts: 2,
          isActive: true
        },
        {
          nama: 'UKMPPD Simulasi Free',
          deskripsi: 'Simulasi UKMPPD gratis dengan 100 soal',
          harga: 0,
          durasi: 180,
          jumlahSoal: 100,
          maxAttempts: 1,
          isActive: true
        },
        {
          nama: 'UKMPPD Simulasi Premium',
          deskripsi: 'Simulasi UKMPPD premium dengan pembahasan lengkap - 150 soal',
          harga: 50000,
          durasi: 240,
          jumlahSoal: 150,
          maxAttempts: 5,
          isActive: true
        }
      ]
    });

    // Create subject-based packages
    const subjects = [
      { nama: 'Latihan Matematika', jenis: 'matematika' },
      { nama: 'Latihan Fisika', jenis: 'fisika' },
      { nama: 'Latihan Kimia', jenis: 'kimia' },
      { nama: 'Latihan Bahasa Indonesia', jenis: 'bahasa_indonesia' },
      { nama: 'Latihan Bahasa Inggris', jenis: 'bahasa_inggris' }
    ];

    const subjectPackages = await prisma.paket.createMany({
      data: subjects.map(subject => ({
        nama: subject.nama,
        deskripsi: `Kumpulan soal ${subject.nama.toLowerCase()}`,
        harga: 0,
        durasi: 60,
        jumlahSoal: 0,
        maxAttempts: 999,
        isActive: true
      }))
    });

    const totalCreated = packages.count + subjectPackages.count;

    return NextResponse.json({
      success: true,
      message: `Created ${totalCreated} packages successfully`,
      details: {
        dummyPackages: packages.count,
        subjectPackages: subjectPackages.count,
        total: totalCreated
      }
    });
  } catch (error) {
    console.error('Error creating packages:', error);
    return NextResponse.json({ 
      error: 'Failed to create packages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
