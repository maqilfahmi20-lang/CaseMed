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
    const existingCount = await prisma.package.count();
    
    if (existingCount > 0) {
      return NextResponse.json({ 
        message: `Already has ${existingCount} packages in database`,
        skip: true
      });
    }

    // Create dummy packages
    const packages = await prisma.package.createMany({
      data: [
        {
          nama: 'Latihan Dasar - Paket 1',
          tipe_paket: 'latihan',
          total_soal: 20,
          max_attempt: 3,
          is_free: true,
          harga: 0,
          is_active: true
        },
        {
          nama: 'Latihan Lanjutan - Paket 2',
          tipe_paket: 'latihan',
          total_soal: 30,
          max_attempt: 2,
          is_free: true,
          harga: 0,
          is_active: true
        },
        {
          nama: 'UKMPPD Simulasi Free',
          tipe_paket: 'ukmppd',
          total_soal: 100,
          max_attempt: 1,
          is_free: true,
          harga: 0,
          is_active: true
        },
        {
          nama: 'UKMPPD Simulasi Premium',
          tipe_paket: 'ukmppd',
          total_soal: 150,
          max_attempt: 5,
          is_free: false,
          harga: 50000,
          is_active: true
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

    const subjectPackages = await prisma.package.createMany({
      data: subjects.map(subject => ({
        nama: subject.nama,
        tipe_paket: 'latihan',
        total_soal: 0,
        max_attempt: 999,
        is_free: true,
        harga: 0,
        is_active: true
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
