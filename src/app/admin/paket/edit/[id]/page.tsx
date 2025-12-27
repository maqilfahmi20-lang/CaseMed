import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditPaketForm from './form';

export default async function EditPaketPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const paket = await prisma.package.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        include: {
          question: true
        }
      }
    }
  });

  if (!paket) {
    notFound();
  }

  // Get all questions for selection
  const allQuestions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <EditPaketForm paket={paket} allQuestions={allQuestions} />;
}
