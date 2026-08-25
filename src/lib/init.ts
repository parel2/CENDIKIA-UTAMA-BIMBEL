import { SEED_QUESTIONS } from './seed';
import { getAllQuestions, putQuestions } from './db';

const SEED_VERSION = 3;
const META_KEY = 'seedVersion';

export async function ensureSeedData(): Promise<void> {
  const storedVersion = parseInt(localStorage.getItem(META_KEY) ?? '0', 10);
  if (storedVersion >= SEED_VERSION) return;

  const existing = await getAllQuestions();
  const seedIds = new Set(SEED_QUESTIONS.map((q) => q.id));
  const nonSeed = existing.filter((q) => !seedIds.has(q.id));
  await putQuestions([...nonSeed, ...SEED_QUESTIONS]);
  localStorage.setItem(META_KEY, String(SEED_VERSION));
}
