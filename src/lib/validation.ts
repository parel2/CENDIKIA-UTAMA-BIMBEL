import type { Question, ModuleId, QuestionType } from './types';

const VALID_MODULES: ModuleId[] = ['membaca', 'menulis', 'berhitung'];
const VALID_TYPES: QuestionType[] = [
  'pilihan_ganda',
  'isian',
  'menyalin',
  'pemahaman',
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  questions: Question[];
}

export interface RawQuestion {
  id?: string;
  modul?: unknown;
  kelas?: unknown;
  level?: unknown;
  tipe_soal?: unknown;
  pertanyaan?: unknown;
  pilihan?: unknown;
  jawaban_benar?: unknown;
  penjelasan?: unknown;
  teks_bacaan?: unknown;
  kata_kunci?: unknown;
  toleransi?: unknown;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isInt(v: unknown, min: number, max: number): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

export function validateQuestions(
  raw: unknown,
  existingIds: Set<string>
): ValidationResult {
  const errors: string[] = [];
  const questions: Question[] = [];

  let arr: RawQuestion[];
  if (Array.isArray(raw)) {
    arr = raw as RawQuestion[];
  } else if (raw && typeof raw === 'object' && Array.isArray((raw as { questions?: unknown }).questions)) {
    arr = (raw as { questions: RawQuestion[] }).questions;
  } else if (raw && typeof raw === 'object' && 'modul' in (raw as object)) {
    arr = [raw as RawQuestion];
  } else {
    return {
      valid: false,
      errors: ['Format tidak valid: harus berupa array soal atau objek dengan field "questions".'],
      questions: [],
    };
  }

  if (arr.length === 0) {
    return { valid: false, errors: ['Tidak ada soal yang ditemukan dalam data.'], questions: [] };
  }

  arr.forEach((item, idx) => {
    const prefix = `Soal #${idx + 1}: `;

    if (!item || typeof item !== 'object') {
      errors.push(`${prefix}bukan objek yang valid.`);
      return;
    }

    if (!isNonEmptyString(item.modul) || !VALID_MODULES.includes(item.modul as ModuleId)) {
      errors.push(`${prefix}field "modul" harus salah satu dari: ${VALID_MODULES.join(', ')}.`);
      return;
    }

    if (!isInt(item.kelas, 1, 5)) {
      errors.push(`${prefix}field "kelas" harus bilangan bulat 1-5.`);
      return;
    }

    if (!isInt(item.level, 1, 5)) {
      errors.push(`${prefix}field "level" harus bilangan bulat 1-5.`);
      return;
    }

    if (!isNonEmptyString(item.tipe_soal) || !VALID_TYPES.includes(item.tipe_soal as QuestionType)) {
      errors.push(`${prefix}field "tipe_soal" harus salah satu dari: ${VALID_TYPES.join(', ')}.`);
      return;
    }

    if (!isNonEmptyString(item.pertanyaan)) {
      errors.push(`${prefix}field "pertanyaan" wajib diisi.`);
      return;
    }

    if (!isNonEmptyString(item.jawaban_benar)) {
      errors.push(`${prefix}field "jawaban_benar" wajib diisi.`);
      return;
    }

    if (item.tipe_soal === 'pilihan_ganda') {
      if (!Array.isArray(item.pilihan) || item.pilihan.length < 2) {
        errors.push(`${prefix}tipe "pilihan_ganda" wajib memiliki field "pilihan" dengan minimal 2 opsi.`);
        return;
      }
      if (!isStringArray(item.pilihan)) {
        errors.push(`${prefix}field "pilihan" harus berupa array string.`);
        return;
      }
      if (!item.pilihan.includes(item.jawaban_benar)) {
        errors.push(`${prefix}"jawaban_benar" harus ada di dalam array "pilihan".`);
        return;
      }
    }

    if (item.penjelasan !== undefined && !isNonEmptyString(item.penjelasan)) {
      errors.push(`${prefix}field "penjelasan" harus berupa string jika diisi.`);
      return;
    }

    if (item.teks_bacaan !== undefined && !isNonEmptyString(item.teks_bacaan)) {
      errors.push(`${prefix}field "teks_bacaan" harus berupa string jika diisi.`);
      return;
    }

    if (item.kata_kunci !== undefined && !isStringArray(item.kata_kunci)) {
      errors.push(`${prefix}field "kata_kunci" harus berupa array string jika diisi.`);
      return;
    }

    if (item.toleransi !== undefined && typeof item.toleransi !== 'number') {
      errors.push(`${prefix}field "toleransi" harus berupa angka jika diisi.`);
      return;
    }

    const id = isNonEmptyString(item.id) ? item.id : crypto.randomUUID();
    if (existingIds.has(id)) {
      // Generate new ID to avoid collision — append mode
      questions.push({
        id: crypto.randomUUID(),
        modul: item.modul as ModuleId,
        kelas: item.kelas,
        level: item.level,
        tipe_soal: item.tipe_soal as QuestionType,
        pertanyaan: item.pertanyaan,
        pilihan: item.pilihan as string[] | undefined,
        jawaban_benar: item.jawaban_benar,
        penjelasan: item.penjelasan,
        teks_bacaan: item.teks_bacaan,
        kata_kunci: item.kata_kunci as string[] | undefined,
        toleransi: item.toleransi as number | undefined,
        is_new: true,
      });
    } else {
      questions.push({
        id,
        modul: item.modul as ModuleId,
        kelas: item.kelas,
        level: item.level,
        tipe_soal: item.tipe_soal as QuestionType,
        pertanyaan: item.pertanyaan,
        pilihan: item.pilihan as string[] | undefined,
        jawaban_benar: item.jawaban_benar,
        penjelasan: item.penjelasan,
        teks_bacaan: item.teks_bacaan,
        kata_kunci: item.kata_kunci as string[] | undefined,
        toleransi: item.toleransi as number | undefined,
        is_new: true,
      });
    }
  });

  return { valid: errors.length === 0, errors, questions };
}
