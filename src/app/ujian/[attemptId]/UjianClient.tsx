'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitAnswer, finishAttempt } from '@/app/actions/ujian';

interface Question {
  id: string;
  kategori: string;
  jenis_soal: string | null;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  opsi_e: string;
  jawaban_benar: string;
  pembahasan: string | null;
}

interface AttemptQuestion {
  id: string;
  question_id: string;
  urutan: number;
  jawaban_user: string | null;
  question: Question;
}

interface Attempt {
  id: string;
  mulai_at: Date;
  package: {
    nama: string;
    total_soal: number;
  };
  questions: AttemptQuestion[];
}

export default function UjianClient({ attempt }: { attempt: Attempt }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const currentQuestion = attempt.questions[currentIndex];
  const totalQuestions = attempt.questions.length;

  // Initialize answers from existing attempt
  useEffect(() => {
    const initialAnswers: Record<string, string> = {};
    attempt.questions.forEach(aq => {
      if (aq.jawaban_user) {
        initialAnswers[aq.question_id] = aq.jawaban_user;
      }
    });
    setAnswers(initialAnswers);

    // Calculate time left (2 hours from start)
    const startTime = new Date(attempt.mulai_at).getTime();
    const endTime = startTime + (2 * 60 * 60 * 1000); // 2 hours
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
    setTimeLeft(remaining);
  }, [attempt]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = async (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.question_id]: answer
    }));

    // Auto save to backend
    await submitAnswer(attempt.id, currentQuestion.question_id, answer);
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = async () => {
    if (isSubmitting) return;
    setShowFinishModal(true);
  };

  const confirmFinish = async () => {
    setIsSubmitting(true);

    try {
      const result = await finishAttempt(attempt.id);

      if (result.error) {
        alert(result.error);
        setIsSubmitting(false);
        setShowFinishModal(false);
        return;
      }

      router.push(`/hasil/${attempt.id}`);
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan');
      setIsSubmitting(false);
      setShowFinishModal(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Finish Confirmation Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
              <div className="text-6xl mb-3">🎯</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Selesaikan Ujian?
              </h2>
              <p className="text-green-100 text-sm">
                Pastikan semua jawaban sudah benar
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{answeredCount}</div>
                    <div className="text-xs text-gray-600 mt-1">Soal Dijawab</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-400">{unansweredCount}</div>
                    <div className="text-xs text-gray-600 mt-1">Belum Dijawab</div>
                  </div>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">⚠️</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">Perhatian!</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Masih ada {unansweredCount} soal yang belum dijawab. Soal yang tidak dijawab akan dianggap salah.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>Jawaban sudah tersimpan otomatis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>Hasil akan langsung tersedia</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>Pembahasan bisa dilihat setelah selesai</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFinishModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  ← Kembali
                </button>
                <button
                  onClick={confirmFinish}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </span>
                  ) : (
                    '✓ Ya, Selesaikan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{attempt.package.nama}</h1>
              <p className="text-sm text-gray-600">
                Soal {currentIndex + 1} dari {totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`text-2xl font-bold ${timeLeft < 600 ? 'text-red-600' : 'text-gray-800'}`}>
                  ⏱️ {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-gray-600">Waktu Tersisa</div>
              </div>
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Mengirim...' : 'Selesai'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              {/* Question */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    currentQuestion.question.kategori === 'ukmppd'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentQuestion.question.kategori}
                  </span>
                  {currentQuestion.question.jenis_soal && (
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {currentQuestion.question.jenis_soal.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.question.pertanyaan}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {['a', 'b', 'c', 'd', 'e'].map((option) => {
                  const optionKey = `opsi_${option}` as keyof Question;
                  const optionText = currentQuestion.question[optionKey] as string;
                  const isSelected = answers[currentQuestion.question_id] === option;

                  return (
                    <label
                      key={option}
                      className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswer(option)}
                        className="mt-1 w-5 h-5 text-blue-600"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-700 mr-2">{option.toUpperCase()}.</span>
                        <span className="text-gray-800">{optionText}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Sebelumnya
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === totalQuestions - 1}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Navigasi Soal</h3>
              
              <div className="flex gap-2 text-xs mb-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Dijawab ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span>Belum ({unansweredCount})</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {attempt.questions.map((aq, index) => {
                  const isAnswered = !!answers[aq.question_id];
                  const isCurrent = index === currentIndex;

                  return (
                    <button
                      key={aq.id}
                      onClick={() => goToQuestion(index)}
                      className={`aspect-square rounded-lg font-semibold text-sm transition ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : isAnswered
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
