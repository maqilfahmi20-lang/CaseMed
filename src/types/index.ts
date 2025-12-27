// ============================================
// TYPE DEFINITIONS FOR MVP
// ============================================

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface User {
  id?: string;
  name: string;
  email: string;
  isPremium: boolean;
  avatar?: string;
  createdAt?: string;
}

export interface ExamResult {
  id?: string;
  userId?: string;
  answers: { [key: number]: number };
  score: number;
  totalQuestions: number;
  date: string;
  type: 'latihan' | 'simulasi';
  duration?: number;
  completedAt?: string;
}

export interface ExamSession {
  id?: string;
  userId?: string;
  examType: 'latihan' | 'simulasi';
  startedAt: string;
  currentQuestion: number;
  answers: { [key: number]: number };
  timeLeft: number;
  status: 'in-progress' | 'completed' | 'abandoned';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
