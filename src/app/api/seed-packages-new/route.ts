import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.secret !== process.env.AUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete old packages without kategori
    const deleted = await prisma.package.deleteMany({
      where: { kategori: null }
    });

    // Create Simulasi packages
    const simulasiPackages = [
      {
        nama: 'Simulasi Basic Medical Science (GRATIS)',
        tipe_paket: 'simulasi',
        kategori: KATEGORI_UKMPPD[0],
        total_soal: 50,
        max_attempt: 3,
        is_free: true,
        harga: 0,
        is_active: true,
      },
      ...KATEGORI_UKMPPD.map((kategori, index) => ({
        nama: `Simulasi ${kategori}`,
        tipe_paket: 'simulasi',
        kategori: kategori,
        total_soal: 50 + Math.floor(index / 2) * 10,
        max_attempt: 3,
        is_free: false,
        harga: 30000 + Math.floor(index / 3) * 5000,
        is_active: true,
      }))
    ];

    // Create Latihan packages
    const latihanPackages = [
      {
        nama: 'Latihan Basic Medical Science (GRATIS)',
        tipe_paket: 'latihan',
        kategori: KATEGORI_UKMPPD[0],
        total_soal: 50,
        max_attempt: 999,
        is_free: true,
        harga: 0,
        is_active: true,
      },
      {
        nama: 'Latihan Sistem Kardiovaskular dan Hematologi (GRATIS)',
        tipe_paket: 'latihan',
        kategori: KATEGORI_UKMPPD[3],
        total_soal: 40,
        max_attempt: 999,
        is_free: true,
        harga: 0,
        is_active: true,
      },
      ...KATEGORI_UKMPPD.map((kategori, index) => ({
        nama: `Latihan ${kategori}`,
        tipe_paket: 'latihan',
        kategori: kategori,
        total_soal: 40 + Math.floor(index / 2) * 10,
        max_attempt: 5,
        is_free: false,
        harga: 25000 + Math.floor(index / 3) * 5000,
        is_active: true,
      }))
    ];

    const allPackages = [...simulasiPackages, ...latihanPackages];
    
    for (const pkg of allPackages) {
      await prisma.package.create({ data: pkg });
    }

    const stats = {
      deleted: deleted.count,
      created: allPackages.length,
      simulasi: simulasiPackages.length,
      latihan: latihanPackages.length
    };

    return NextResponse.json({ 
      success: true,
      message: 'Packages seeded successfully',
      stats
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
