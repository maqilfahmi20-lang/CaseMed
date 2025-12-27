'use server';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createQuestion(formData: FormData) {
  await requireAdmin();

  const kategori = formData.get('kategori') as string;
  const jenis_soal = formData.get('jenis_soal') as string;
  const pertanyaan = formData.get('pertanyaan') as string;
  const opsi_a = formData.get('opsi_a') as string;
  const opsi_b = formData.get('opsi_b') as string;
  const opsi_c = formData.get('opsi_c') as string;
  const opsi_d = formData.get('opsi_d') as string;
  const opsi_e = formData.get('opsi_e') as string;
  const jawaban_benar = formData.get('jawaban_benar') as string;
  const pembahasan = formData.get('pembahasan') as string;

  // Validasi
  if (!pertanyaan || !opsi_a || !opsi_b || !opsi_c || !opsi_d || !opsi_e || !jawaban_benar) {
    return { error: 'Semua field wajib diisi!' };
  }

  try {
    await prisma.question.create({
      data: {
        kategori,
        jenis_soal: jenis_soal || null,
        pertanyaan,
        opsi_a,
        opsi_b,
        opsi_c,
        opsi_d,
        opsi_e,
        jawaban_benar,
        pembahasan: pembahasan || null,
      },
    });

    revalidatePath('/admin/soal');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateQuestion(id: string, formData: FormData) {
  await requireAdmin();

  const kategori = formData.get('kategori') as string;
  const jenis_soal = formData.get('jenis_soal') as string;
  const pertanyaan = formData.get('pertanyaan') as string;
  const opsi_a = formData.get('opsi_a') as string;
  const opsi_b = formData.get('opsi_b') as string;
  const opsi_c = formData.get('opsi_c') as string;
  const opsi_d = formData.get('opsi_d') as string;
  const opsi_e = formData.get('opsi_e') as string;
  const jawaban_benar = formData.get('jawaban_benar') as string;
  const pembahasan = formData.get('pembahasan') as string;

  try {
    await prisma.question.update({
      where: { id },
      data: {
        kategori,
        jenis_soal: jenis_soal || null,
        pertanyaan,
        opsi_a,
        opsi_b,
        opsi_c,
        opsi_d,
        opsi_e,
        jawaban_benar,
        pembahasan: pembahasan || null,
      },
    });

    revalidatePath('/admin/soal');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteQuestion(id: string) {
  await requireAdmin();

  try {
    await prisma.question.delete({
      where: { id },
    });

    revalidatePath('/admin/soal');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
