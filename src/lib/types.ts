export type ModuleId = 'membaca' | 'menulis' | 'berhitung';

export type QuestionType =
  | 'pilihan_ganda'
  | 'isian'
  | 'menyalin'
  | 'pemahaman';

export interface Question {
  id: string;
  modul: ModuleId;
  kelas: number;
  level: number;
  tipe_soal: QuestionType;
  pertanyaan: string;
  pilihan?: string[];
  jawaban_benar: string;
  penjelasan?: string;
  teks_bacaan?: string;
  kata_kunci?: string[];
  toleransi?: number;
  is_new?: boolean;
}

export interface QuestionBank {
  version: number;
  updated_at: string;
  questions: Question[];
}

export interface Profile {
  id: string;
  nama: string;
  avatar: string;
  created_at: string;
}

export interface ProgressEntry {
  modul: ModuleId;
  kelas: number;
  level: number;
  nilai: number;
  benar: number;
  salah: number;
  total: number;
  completed_at: string;
}

export interface ProfileProgress {
  unlocked: string[];
  progress: ProgressEntry[];
}

export interface Snapshot {
  id: string;
  created_at: string;
  data: QuestionBank;
}

export const MODULES: { id: ModuleId; label: string; icon: string; color: string }[] = [
  { id: 'membaca', label: 'Membaca', icon: 'BookOpen', color: 'emerald' },
  { id: 'menulis', label: 'Menulis', icon: 'PenLine', color: 'amber' },
  { id: 'berhitung', label: 'Berhitung', icon: 'Calculator', color: 'sky' },
];

export const KELAS_LIST = [1, 2, 3, 4, 5];
export const LEVELS_PER_KELAS = [1, 2, 3, 4, 5];
export const PASSING_SCORE = 70;
export const TEACHER_CODE = '1234';
