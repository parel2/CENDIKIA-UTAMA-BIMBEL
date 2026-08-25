import type { ModuleId, QuestionType } from './types';

export function getModuleIcon(modul: ModuleId): string {
  switch (modul) {
    case 'membaca': return 'BookOpen';
    case 'menulis': return 'PenLine';
    case 'berhitung': return 'Calculator';
  }
}

export function getModuleColor(modul: ModuleId): { bg: string; text: string; border: string; gradient: string } {
  switch (modul) {
    case 'membaca':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', gradient: 'from-emerald-400 to-teal-500' };
    case 'menulis':
      return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', gradient: 'from-amber-400 to-orange-500' };
    case 'berhitung':
      return { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-300', gradient: 'from-sky-400 to-blue-500' };
  }
}

export function getTypeLabel(tipe: QuestionType): string {
  switch (tipe) {
    case 'pilihan_ganda': return 'Pilihan Ganda';
    case 'isian': return 'Isian';
    case 'menyalin': return 'Menyalin';
    case 'pemahaman': return 'Pemahaman Bacaan';
  }
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function checkAnswer(
  userAnswer: string,
  question: { jawaban_benar: string; tipe_soal: QuestionType; kata_kunci?: string[]; toleransi?: number }
): boolean {
  if (question.tipe_soal === 'isian' || question.tipe_soal === 'menyalin') {
    const ua = normalizeAnswer(userAnswer);
    const ca = normalizeAnswer(question.jawaban_benar);
    if (question.kata_kunci && question.kata_kunci.length > 0) {
      return question.kata_kunci.some((k) => normalizeAnswer(k) === ua);
    }
    if (question.toleransi && question.toleransi > 0) {
      const uaNum = parseFloat(ua);
      const caNum = parseFloat(ca);
      if (!isNaN(uaNum) && !isNaN(caNum)) {
        return Math.abs(uaNum - caNum) <= question.toleransi;
      }
    }
    return ua === ca;
  }
  return normalizeAnswer(userAnswer) === normalizeAnswer(question.jawaban_benar);
}

export function getNextBab(modul: string, kelas: number, level: number): { kelas: number; level: number } | null {
  if (level < 5) return { kelas, level: level + 1 };
  if (kelas < 5) return { kelas: kelas + 1, level: 1 };
  return null;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}
