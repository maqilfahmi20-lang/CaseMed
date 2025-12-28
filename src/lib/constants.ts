// ============================================
// CONSTANTS FOR THE APPLICATION
// ============================================

// Kategori UKMPPD
export const KATEGORI_UKMPPD = [
  'Basic Medical Science',
  'Etika, Hukum, dan Profesionalisme Kedokteran',
  'Sistem Saraf dan Perilaku',
  'Sistem Kardiovaskular dan Hematologi',
  'Sistem Respirasi',
  'Sistem Gastrointestinal dan Hepatobilier',
  'Sistem Ginjal dan Saluran Kemih',
  'Sistem Endokrin dan Metabolik',
  'Sistem Reproduksi dan Kesehatan Ibu dan Anak',
  'Sistem Muskuloskeletal dan Reumatologi',
  'Sistem Integumen',
  'Penyakit Infeksi dan Penyakit Tropis',
  'Ilmu Penyakit Dalam Terpadu',
  'Bedah Terpadu dan Kegawatdaruratan',
  'Kedokteran Keluarga dan Komunitas',
  'Gawat Darurat dan Patient Safety'
] as const;

// Subscription constants (Netflix-style monthly subscription)
export const SUBSCRIPTION_PRICE = 55000; // Rp 55.000 per bulan
export const SUBSCRIPTION_DURATION_DAYS = 30; // 30 hari

// Exam durations in seconds
export const EXAM_DURATIONS = {
  LATIHAN: 1800, // 30 minutes (20 soal)
  SIMULASI: 12000, // 200 minutes (150 soal)
  TRYOUT: 10800, // 3 hours
} as const;

// Timer warning threshold (seconds)
export const TIMER_WARNING_THRESHOLD = 600; // 10 minutes

// Question counts
export const QUESTION_COUNTS = {
  LATIHAN: 20,
  SIMULASI: 150,
  TRYOUT: 200,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  AUTH_TOKEN: 'authToken',
  LATIHAN_RESULT: 'latestResult',
  SIMULASI_RESULT: 'examResult',
  EXAM_SESSION: 'examSession',
} as const;

// API endpoints (for when backend is ready)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  QUESTIONS: {
    DAILY: '/questions/daily',
    EXAM: '/questions/exam',
    BY_ID: '/questions',
  },
  RESULTS: {
    SUBMIT: '/results',
    LIST: '/results',
    BY_ID: '/results',
    STATS: '/results/stats',
  },
  PAYMENT: {
    CREATE: '/payments/create',
    VERIFY: '/payments/verify',
    WEBHOOK: '/payments/webhook',
  },
} as const;

// Question categories
export const QUESTION_CATEGORIES = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'IPA (Sains)',
  'IPS (Sosial)',
  'Logika',
  'TPA',
] as const;

// Difficulty levels
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

// Premium features (for paywall)
export const PREMIUM_FEATURES = [
  'Akses semua soal latihan',
  'Tryout simulasi lengkap',
  'Analisis hasil detail',
  'Pembahasan soal lengkap',
  'Download sertifikat',
  'Ranking & leaderboard',
] as const;

// Pricing plans
export const PRICING_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['10 soal harian', 'Hasil basic'],
  },
  MONTHLY: {
    name: 'Monthly',
    price: 99000,
    features: PREMIUM_FEATURES,
  },
  YEARLY: {
    name: 'Yearly',
    price: 999000,
    features: [...PREMIUM_FEATURES, 'Hemat 16%'],
  },
} as const;

// Score thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GREAT: 80,
  GOOD: 70,
  FAIR: 60,
  POOR: 0,
} as const;

// Auto-save interval (milliseconds)
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// Max retries for API calls
export const MAX_API_RETRIES = 3;

// Request timeout (milliseconds)
export const REQUEST_TIMEOUT = 10000; // 10 seconds
