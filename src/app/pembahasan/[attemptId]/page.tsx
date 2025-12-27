import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PembahasanPage({ params }: { params: { attemptId: string } }) {
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

  if (!attempt || !attempt.selesai_at) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Pembahasan</h1>
              <p className="text-sm text-gray-600">{attempt.package.nama}</p>
            </div>
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {attempt.questions.map((aq, index) => {
            const isCorrect = aq.is_correct;
            const userAnswer = aq.jawaban_user;
            const correctAnswer = aq.question.jawaban_benar;

            return (
              <div key={aq.id} className="bg-white rounded-xl shadow-sm border p-6">
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                      Soal #{index + 1}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      aq.question.kategori === 'ukmppd'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {aq.question.kategori}
                    </span>
                    {aq.question.jenis_soal && (
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {aq.question.jenis_soal.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    isCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect ? '✓ Benar' : '✗ Salah'}
                  </span>
                </div>

                {/* Question */}
                <div className="mb-4">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {aq.question.pertanyaan}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2 mb-4">
                  {['a', 'b', 'c', 'd', 'e'].map((option) => {
                    const optionKey = `opsi_${option}` as keyof typeof aq.question;
                    const optionText = aq.question[optionKey] as string;
                    const isUserAnswer = userAnswer === option;
                    const isCorrectAnswer = correctAnswer === option;

                    let bgColor = 'bg-gray-50';
                    let borderColor = 'border-gray-200';
                    let textColor = 'text-gray-800';

                    if (isCorrectAnswer) {
                      bgColor = 'bg-green-50';
                      borderColor = 'border-green-500';
                      textColor = 'text-green-900';
                    } else if (isUserAnswer && !isCorrect) {
                      bgColor = 'bg-red-50';
                      borderColor = 'border-red-500';
                      textColor = 'text-red-900';
                    }

                    return (
                      <div
                        key={option}
                        className={`flex items-start gap-3 p-3 border-2 rounded-lg ${bgColor} ${borderColor}`}
                      >
                        <span className={`font-semibold ${textColor}`}>
                          {option.toUpperCase()}.
                        </span>
                        <span className={textColor}>
                          {optionText}
                          {isCorrectAnswer && <span className="ml-2 text-green-600 font-semibold">✓ Jawaban Benar</span>}
                          {isUserAnswer && !isCorrect && <span className="ml-2 text-red-600 font-semibold">✗ Jawaban Anda</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Pembahasan */}
                {aq.question.pembahasan && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Pembahasan:</h4>
                    <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">
                      {aq.question.pembahasan}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
