'use server';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPackage(formData: FormData) {
  await requireAdmin();

  const nama = formData.get('nama') as string;
  const tipe_paket = formData.get('tipe_paket') as string;
  const kategori = formData.get('kategori') as string | null;
  const total_soal = parseInt(formData.get('total_soal') as string);
  const max_attempt = parseInt(formData.get('max_attempt') as string);
  const is_free = formData.get('is_free') === 'true';
  const harga = is_free ? 0 : parseInt(formData.get('harga') as string);
  const is_active = formData.get('is_active') === 'true';

  if (!nama || !tipe_paket || !total_soal || !max_attempt) {
    return { error: 'Semua field wajib diisi!' };
  }

  // Validate kategori for latihan type
  if (tipe_paket === 'latihan' && !kategori) {
    return { error: 'Kategori wajib diisi untuk paket Latihan!' };
  }

  // Validate kategori for simulasi type
  if (tipe_paket === 'simulasi' && !kategori) {
    return { error: 'Kategori wajib diisi untuk paket Simulasi!' };
  }

  try {
    const newPackage = await prisma.package.create({
      data: {
        nama,
        tipe_paket,
        kategori,
        total_soal,
        max_attempt,
        is_free,
        harga,
        is_active,
      },
    });

    revalidatePath('/admin/paket');
    revalidatePath('/admin/dashboard');
    revalidatePath('/dashboard');
    revalidatePath('/simulasi');
    revalidatePath('/latihan');
    return { success: true, id: newPackage.id };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updatePackage(id: string, formData: FormData) {
  await requireAdmin();

  const nama = formData.get('nama') as string;
  const tipe_paket = formData.get('tipe_paket') as string;
  const kategori = formData.get('kategori') as string | null;
  const total_soal = parseInt(formData.get('total_soal') as string);
  const max_attempt = parseInt(formData.get('max_attempt') as string);
  const is_free = formData.get('is_free') === 'true';
  const harga = is_free ? 0 : parseInt(formData.get('harga') as string);
  const is_active = formData.get('is_active') === 'true';

  // Validate kategori for latihan type
  if (tipe_paket === 'latihan' && !kategori) {
    return { error: 'Kategori wajib diisi untuk paket Latihan!' };
  }

  // Validate kategori for simulasi type
  if (tipe_paket === 'simulasi' && !kategori) {
    return { error: 'Kategori wajib diisi untuk paket Simulasi!' };
  }

  try {
    await prisma.package.update({
      where: { id },
      data: {
        nama,
        tipe_paket,
        kategori,
        total_soal,
        max_attempt,
        is_free,
        harga,
        is_active,
      },
    });

    revalidatePath('/admin/paket');
    revalidatePath('/admin/dashboard');
    revalidatePath('/dashboard');
    revalidatePath('/simulasi');
    revalidatePath('/latihan');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deletePackage(id: string) {
  await requireAdmin();

  try {
    // Check if package has questions assigned
    const packageWithQuestions = await prisma.package.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            questions: true,
            attempts: true,
          }
        }
      }
    });

    if (!packageWithQuestions) {
      return { error: 'Paket tidak ditemukan!' };
    }

    if (packageWithQuestions._count.questions > 0) {
      return { error: `Tidak bisa menghapus! Paket ini memiliki ${packageWithQuestions._count.questions} soal yang terhubung.` };
    }

    if (packageWithQuestions._count.attempts > 0) {
      return { error: `Tidak bisa menghapus! Paket ini sudah digunakan oleh ${packageWithQuestions._count.attempts} user.` };
    }

    await prisma.package.delete({
      where: { id }
    });

    revalidatePath('/admin/paket');
    revalidatePath('/admin/dashboard');
    revalidatePath('/dashboard');
    revalidatePath('/simulasi');
    revalidatePath('/latihan');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function assignQuestionsToPackage(packageId: string, questionIds: string[]) {
  await requireAdmin();

  try {
    // Delete existing assignments
    await prisma.packageQuestion.deleteMany({
      where: { package_id: packageId }
    });

    // Create new assignments
    if (questionIds.length > 0) {
      await prisma.packageQuestion.createMany({
        data: questionIds.map(questionId => ({
          package_id: packageId,
          question_id: questionId,
        }))
      });
    }

    revalidatePath('/admin/paket');
    revalidatePath(`/admin/paket/edit/${packageId}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
