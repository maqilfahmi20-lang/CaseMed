import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.secret !== process.env.AUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update all existing packages to set kategori = NULL if not set
    const updated = await prisma.package.updateMany({
      where: {
        kategori: null
      },
      data: {
        kategori: null // Ensure field exists, no actual change needed
      }
    });

    // Get stats
    const total = await prisma.package.count();
    const withKategori = await prisma.package.count({
      where: { kategori: { not: null } }
    });
    const withoutKategori = await prisma.package.count({
      where: { kategori: null }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Migration check completed',
      stats: {
        total,
        withKategori,
        withoutKategori,
        updated: updated.count
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== process.env.AUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check database status
    const packages = await prisma.package.findMany({
      select: {
        id: true,
        nama: true,
        tipe_paket: true,
        kategori: true,
      },
      take: 10
    });

    const stats = {
      total: await prisma.package.count(),
      simulasi: await prisma.package.count({ where: { tipe_paket: 'simulasi' } }),
      latihan: await prisma.package.count({ where: { tipe_paket: 'latihan' } }),
      withKategori: await prisma.package.count({ where: { kategori: { not: null } } }),
      withoutKategori: await prisma.package.count({ where: { kategori: null } }),
    };

    return NextResponse.json({ 
      success: true,
      stats,
      samplePackages: packages,
      databaseUrl: process.env.DATABASE_URL?.includes('railway') ? 'Railway Production' : 'Local/Other'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
