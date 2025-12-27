// ============================================
// UTILITY FUNCTIONS
// Helper functions for common operations
// ============================================

/**
 * Format time in seconds to readable string
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate score percentage
 */
export function calculateScore(correctCount: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  return (correctCount / totalQuestions) * 100;
}

/**
 * Get grade emoji based on score
 */
export function getScoreEmoji(score: number): string {
  if (score >= 90) return '🏆';
  if (score >= 80) return '🎉';
  if (score >= 70) return '😊';
  if (score >= 60) return '👍';
  return '💪';
}

/**
 * Get grade message based on score
 */
export function getScoreMessage(score: number): string {
  if (score >= 90) return 'Sempurna! Luar biasa sekali!';
  if (score >= 80) return 'Luar biasa! Hasil yang sangat bagus!';
  if (score >= 70) return 'Bagus! Pertahankan!';
  if (score >= 60) return 'Cukup baik, terus tingkatkan!';
  return 'Terus berlatih, pasti bisa lebih baik!';
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate random string (for demo IDs)
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Shuffle array (for randomizing questions)
 * TODO: Backend should handle question randomization
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Calculate statistics from array of numbers
 */
export function calculateStats(numbers: number[]) {
  if (numbers.length === 0) return { min: 0, max: 0, avg: 0 };
  
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const avg = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  
  return { min, max, avg };
}
