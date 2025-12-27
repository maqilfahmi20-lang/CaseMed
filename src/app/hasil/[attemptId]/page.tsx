import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function HasilPage({ params }: { params: { attemptId: string } }) {
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

  const totalQuestions = attempt.questions.length;
  const correctCount = attempt.questions.filter(aq => aq.is_correct).length;
  const wrongCount = totalQuestions - correctCount;
  const nilai = attempt.nilai || 0;

  // Determine grade
  let grade = '';
  let gradeColor = '';
  if (nilai >= 80) {
    grade = 'Sangat Baik';
    gradeColor = 'text-green-600';
  } else if (nilai >= 70) {
    grade = 'Baik';
    gradeColor = 'text-blue-600';
  } else if (nilai >= 60) {
    grade = 'Cukup';
    gradeColor = 'text-yellow-600';
  } else {
    grade = 'Perlu Perbaikan';
    gradeColor = 'text-red-600';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Result Card */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {nilai >= 80 ? '🎉' : nilai >= 60 ? '👍' : '📚'}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Ujian Selesai!
              </h1>
              <p className="text-gray-600">{attempt.package.nama}</p>
            </div>

            {/* Score */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center mb-6">
              <div className="text-6xl font-bold mb-2">{nilai.toFixed(1)}</div>
              <div className={`text-2xl font-semibold ${gradeColor} bg-white px-6 py-2 rounded-full inline-block`}>
                {grade}
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-2xl font-bold text-gray-800">{totalQuestions}</div>
                <div className="text-sm text-gray-600">Total Soal</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-gray-600">Benar</div>
              </div>
              <div className="bg-red-50 rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">❌</div>
                <div className="text-2xl font-bold text-red-600">{wrongCount}</div>
                <div className="text-sm text-gray-600">Salah</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                Kembali ke Dashboard
              </Link>
              <Link
                href={`/pembahasan/${attempt.id}`}
                className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Lihat Pembahasan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
