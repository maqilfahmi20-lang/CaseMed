'use client';

import { useState } from 'react';
import Link from 'next/link';

type Package = {
  id: string;
  nama: string;
  tipe_paket: string;
  kategori: string | null;
  total_soal: number;
  max_attempt: number;
  is_free: boolean;
  harga: number | null;
  _count: {
    questions: number;
  };
};

type UserAttempt = {
  id: string;
  package_id: string;
  attempt_ke: number;
  nilai: number | null;
  mulai_at: Date;
  selesai_at: Date | null;
};

type SubtestAccordionProps = {
  kategori: string;
  packages: Package[];
  userAttempts: UserAttempt[];
  isSubscriptionActive: boolean;
};

export default function SubtestAccordion({
  kategori,
  packages,
  userAttempts,
  isSubscriptionActive
}: SubtestAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 overflow-hidden">
      {/* Kategori Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 hover:from-green-600 hover:to-green-700 transition"
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📚</span>
              <span>{kategori}</span>
            </h3>
            <p className="text-white/80 text-sm mt-1">
              {packages.length} paket latihan tersedia
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-sm">
              {isOpen ? 'Tutup' : 'Lihat Paket'}
            </span>
            <svg
              className={`w-6 h-6 text-white transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Packages List - Expandable */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 space-y-4">
          {packages.map((pkg, index) => {
            const isPremium = !pkg.is_free && (pkg.harga || 0) > 0;
            const hasAccess = pkg.is_free || isSubscriptionActive;
            const packageAttempts = userAttempts.filter(a => a.package_id === pkg.id);

            return (
              <div
                key={pkg.id}
                className={`border-2 rounded-lg p-5 transition-all ${
                  hasAccess 
                    ? 'border-green-200 hover:border-green-400 hover:shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Package Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {/* Package Number */}
                      <div className={`${
                        isPremium 
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                          : 'bg-gradient-to-br from-green-400 to-green-600'
                      } text-white font-bold text-sm rounded-lg w-10 h-10 flex items-center justify-center shadow`}>
                        {index + 1}
                      </div>

                      {/* Package Name */}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">
                          Paket {index + 1}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <span>📝</span>
                            <span>{pkg._count.questions} soal</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🔄</span>
                            <span>{pkg.max_attempt}x</span>
                          </span>
                        </div>
                      </div>

                      {/* Badge */}
                      {isPremium && (
                        <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                          {hasAccess ? '✨ Premium' : '🔒 Premium'}
                        </div>
                      )}
                      {pkg.is_free && (
                        <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                          🎁 Gratis
                        </div>
                      )}
                    </div>

                    {/* Track Record */}
                    {packageAttempts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <span>📊</span>
                          <span>Track Record:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {packageAttempts.map((attempt) => (
                            <Link
                              key={attempt.id}
                              href={`/hasil/${attempt.id}`}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-2"
                            >
                              <span>Attempt {attempt.attempt_ke}:</span>
                              <span className="font-bold">
                                {attempt.nilai !== null ? `${attempt.nilai.toFixed(0)}` : 'Belum Selesai'}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: CTA Button */}
                  <Link
                    href={hasAccess ? `/paket/${pkg.id}` : '/subscription'}
                    className={`px-6 py-3 rounded-lg font-semibold text-center whitespace-nowrap transition ${
                      hasAccess
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    {hasAccess ? 'Mulai →' : 'Subscribe'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
