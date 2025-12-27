import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Security: Check secret key
    const { secret } = await request.json();
    
    if (secret !== process.env.AUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@tryout.com' }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin already exists',
        admin: {
          email: existingAdmin.email,
          nama: existingAdmin.nama,
          role: existingAdmin.role
        }
      });
    }

    // Create admin
    const hashedPassword = await hashPassword('admin123');
    const admin = await prisma.user.create({
      data: {
        email: 'admin@tryout.com',
        password: hashedPassword,
        nama: 'Administrator',
        role: 'admin'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        email: admin.email,
        nama: admin.nama,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ 
      error: 'Failed to create admin',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
