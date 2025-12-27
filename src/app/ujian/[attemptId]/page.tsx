import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import UjianClient from './UjianClient';

export default async function UjianPage({ params }: { params: { attemptId: string } }) {
  const user = await requireAuth();

  const attempt = await prisma.userAttempt.findFirst({
    where: {
      id: params.attemptId,
      user_id: user.id
    },
    include: {
      package: true,
      questions: {
        include: {
          question: true
        },
        orderBy: {
          urutan: 'asc'
        }
      }
    }
  });

  if (!attempt) {
    notFound();
  }

  // If already finished, redirect to hasil
  if (attempt.selesai_at) {
    redirect(`/hasil/${attempt.id}`);
  }

  return <UjianClient attempt={attempt} />;
}
