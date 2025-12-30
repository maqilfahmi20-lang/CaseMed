'use server';

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function startAttempt(packageId: string) {
  const user = await requireAuth();

  try {
    // Check if package exists and is active
    const pkg = await prisma.package.findFirst({
      where: { 
        id: packageId,
        is_active: true 
      },
      include: {
        questions: {
          include: {
            question: true
          }
        }
      }
    });

    if (!pkg) {
      return { error: 'Paket tidak ditemukan atau tidak aktif' };
    }

    // Check if user has reached max attempts
    const attemptCount = await prisma.userAttempt.count({
      where: {
        user_id: user.id,
        package_id: packageId
      }
    });

    if (attemptCount >= pkg.max_attempt) {
      return { error: 'Anda sudah mencapai batas maksimal percobaan' };
    }

    // Check if package is paid and user has access
    if (!pkg.is_free && pkg.harga && pkg.harga > 0) {
      // Get user subscription status
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          subscriptionStatus: true,
          subscriptionEnd: true,
        }
      });

      // Check if subscription is active
      const isSubscriptionActive = currentUser?.subscriptionStatus === 'active' 
        && currentUser?.subscriptionEnd 
        && new Date(currentUser.subscriptionEnd) > new Date();

      // Check if user has paid specifically for this package
      const hasPackagePayment = await prisma.payment.findFirst({
        where: {
          user_id: user.id,
          package_id: packageId,
          status: 'paid'
        }
      });

      // User must either have active subscription OR have paid for this specific package
      if (!isSubscriptionActive && !hasPackagePayment) {
        return { error: 'Anda belum membeli paket ini atau berlangganan premium' };
      }
    }

    if (pkg.questions.length === 0) {
      return { error: 'Paket belum memiliki soal' };
    }

    // Create attempt
    const attempt = await prisma.userAttempt.create({
      data: {
        user_id: user.id,
        package_id: packageId,
        attempt_ke: attemptCount + 1,
        mulai_at: new Date(),
      }
    });

    // Create attempt questions (shuffle questions)
    const shuffledQuestions = [...pkg.questions].sort(() => Math.random() - 0.5);
    
    await prisma.attemptQuestion.createMany({
      data: shuffledQuestions.map((pq, index) => ({
        attempt_id: attempt.id,
        question_id: pq.question.id,
        urutan: index + 1,
      }))
    });

    revalidatePath(`/paket/${packageId}`);
    return { success: true, attemptId: attempt.id };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function submitAnswer(attemptId: string, questionId: string, answer: string) {
  const user = await requireAuth();

  try {
    // Verify attempt belongs to user
    const attempt = await prisma.userAttempt.findFirst({
      where: {
        id: attemptId,
        user_id: user.id,
        selesai_at: null // Not finished yet
      }
    });

    if (!attempt) {
      return { error: 'Attempt tidak ditemukan atau sudah selesai' };
    }

    // Update answer
    await prisma.attemptQuestion.updateMany({
      where: {
        attempt_id: attemptId,
        question_id: questionId
      },
      data: {
        jawaban_user: answer
      }
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function finishAttempt(attemptId: string) {
  const user = await requireAuth();

  try {
    // Verify attempt belongs to user
    const attempt = await prisma.userAttempt.findFirst({
      where: {
        id: attemptId,
        user_id: user.id,
        selesai_at: null
      },
      include: {
        package: true,
        questions: {
          include: {
            question: true
          }
        }
      }
    });

    if (!attempt) {
      return { error: 'Attempt tidak ditemukan atau sudah selesai' };
    }

    // Calculate score
    let correctCount = 0;
    for (const aq of attempt.questions) {
      if (aq.jawaban_user === aq.question.jawaban_benar) {
        correctCount++;
        // Update is_correct
        await prisma.attemptQuestion.update({
          where: { id: aq.id },
          data: { is_correct: true }
        });
      } else {
        await prisma.attemptQuestion.update({
          where: { id: aq.id },
          data: { is_correct: false }
        });
      }
    }

    const totalQuestions = attempt.questions.length;
    const nilai = (correctCount / totalQuestions) * 100;

    // Update attempt
    await prisma.userAttempt.update({
      where: { id: attemptId },
      data: {
        selesai_at: new Date(),
        nilai: Math.round(nilai * 100) / 100 // Round to 2 decimal places
      }
    });

    revalidatePath(`/paket/${attempt.package_id}`);
    return { success: true, attemptId };
  } catch (error: any) {
    return { error: error.message };
  }
}
