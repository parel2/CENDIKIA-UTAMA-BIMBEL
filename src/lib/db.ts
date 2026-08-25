import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, query, orderBy, writeBatch } from 'firebase/firestore';
import { db as fs } from './firebase';
import type { Question, QuestionBank, Profile, Snapshot, ProgressEntry } from './types';

// ============================================================
// PROFILES + PROGRESS → IndexedDB (per-device, offline-capable)
// ============================================================

const DB_NAME = 'calistung-db';
const DB_VERSION = 1;

const STORES = {
  PROFILES: 'profiles',
  PROGRESS: 'progress',
} as const;

type StoreName = (typeof STORES)[keyof typeof STORES];

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORES.PROFILES)) {
        db.createObjectStore(STORES.PROFILES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
        db.createObjectStore(STORES.PROGRESS, { keyPath: 'profileId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx<T>(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const req = fn(t.objectStore(store));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function txAll<T>(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T[]>): Promise<T[]> {
  const result = await tx(store, mode, fn);
  return result ?? [];
}

async function getAll<T>(store: StoreName): Promise<T[]> {
  return txAll(store, 'readonly', (s) => s.getAll() as IDBRequest<T[]>);
}

async function getOne<T>(store: StoreName, key: string): Promise<T | undefined> {
  return tx(store, 'readonly', (s) => s.get(key) as IDBRequest<T>);
}

async function put<T>(store: StoreName, value: T): Promise<void> {
  await tx(store, 'readwrite', (s) => s.put(value as unknown as object));
}

async function del(store: StoreName, key: string): Promise<void> {
  await tx(store, 'readwrite', (s) => s.delete(key));
}

async function clearStore(store: StoreName): Promise<void> {
  await tx(store, 'readwrite', (s) => s.clear());
}

// ---- Profiles ----

export async function getAllProfiles(): Promise<Profile[]> {
  return getAll<Profile>(STORES.PROFILES);
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  return getOne<Profile>(STORES.PROFILES, id);
}

export async function saveProfile(profile: Profile): Promise<void> {
  await put(STORES.PROFILES, profile);
}

export async function deleteProfile(id: string): Promise<void> {
  await del(STORES.PROFILES, id);
  await del(STORES.PROGRESS, id);
}

// ---- Progress ----

export async function getProfileProgress(profileId: string): Promise<ProgressEntry[]> {
  const record = await getOne<{ profileId: string; entries: ProgressEntry[] }>(STORES.PROGRESS, profileId);
  return record?.entries ?? [];
}

export async function addProgressEntry(profileId: string, entry: ProgressEntry): Promise<void> {
  const existing = await getProfileProgress(profileId);
  const record = { profileId, entries: [...existing, entry] };
  await put(STORES.PROGRESS, record);
}

// ---- Seen questions (for "new" badge tracking) ----

export async function getSeenQuestionKeys(profileId: string): Promise<Set<string>> {
  const record = await getOne<{ profileId: string; seen: string[] }>(STORES.PROGRESS, profileId);
  return new Set(record?.seen ?? []);
}

export async function markQuestionsSeen(profileId: string, questionIds: string[]): Promise<void> {
  const existing = await getSeenQuestionKeys(profileId);
  for (const id of questionIds) existing.add(id);
  const record = { profileId, seen: Array.from(existing) };
  await put(STORES.PROGRESS, record);
}

export async function getNewQuestionKeys(profileId: string): Promise<Set<string>> {
  const questions = await getAllQuestions();
  const seen = await getSeenQuestionKeys(profileId);
  const newKeys = new Set<string>();
  for (const q of questions) {
    if (q.is_new && !seen.has(q.id)) {
      newKeys.add(`${q.modul}:${q.kelas}:${q.level}`);
    }
  }
  return newKeys;
}

// ============================================================
// QUESTIONS + SNAPSHOTS → Firestore (shared across devices)
// ============================================================

export async function getAllQuestions(): Promise<Question[]> {
  const snap = await getDocs(collection(fs, 'questions'));
  return snap.docs.map((d) => d.data() as Question);
}

export function subscribeToQuestions(cb: (questions: Question[]) => void): () => void {
  return onSnapshot(collection(fs, 'questions'), (snap) => {
    cb(snap.docs.map((d) => d.data() as Question));
  });
}

export async function putQuestions(questions: Question[]): Promise<void> {
  const batch = writeBatch(fs);
  for (const q of questions) {
    batch.set(doc(fs, 'questions', q.id), q);
  }
  await batch.commit();
}

export async function replaceAllQuestions(questions: Question[]): Promise<void> {
  const existing = await getAllQuestions();
  const batch = writeBatch(fs);
  for (const q of existing) {
    batch.delete(doc(fs, 'questions', q.id));
  }
  for (const q of questions) {
    batch.set(doc(fs, 'questions', q.id), q);
  }
  await batch.commit();
}

export async function getQuestionBank(): Promise<QuestionBank> {
  const [questions] = await Promise.all([getAllQuestions()]);
  return { version: 1, updated_at: new Date().toISOString(), questions };
}

export async function setQuestionBankMeta(_version: number): Promise<void> {
  void _version;
  // No-op: Firestore is the source of truth, no local version needed
}

// ---- Snapshots ----

export async function createSnapshot(bank: QuestionBank): Promise<Snapshot> {
  const snapshot: Snapshot = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    data: bank,
  };
  await setDoc(doc(fs, 'snapshots', snapshot.id), snapshot);
  return snapshot;
}

export async function getAllSnapshots(): Promise<Snapshot[]> {
  const q = query(collection(fs, 'snapshots'), orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Snapshot);
}

export async function deleteSnapshot(id: string): Promise<void> {
  await deleteDoc(doc(fs, 'snapshots', id));
}

// ---- Export / Import (local backup) ----

export interface ExportData {
  profiles: Profile[];
  progress: { profileId: string; entries: ProgressEntry[] }[];
  questions: Question[];
  snapshots: Snapshot[];
  exported_at: string;
}

export async function exportAllData(): Promise<ExportData> {
  const [profiles, questions, snapshots, progressRecords] = await Promise.all([
    getAllProfiles(),
    getAllQuestions(),
    getAllSnapshots(),
    getAll<{ profileId: string; entries: ProgressEntry[] }>(STORES.PROGRESS),
  ]);
  return {
    profiles,
    progress: progressRecords,
    questions,
    snapshots,
    exported_at: new Date().toISOString(),
  };
}

export async function importAllData(data: ExportData): Promise<void> {
  await clearStore(STORES.PROFILES);
  await clearStore(STORES.PROGRESS);
  if (data.profiles) {
    for (const p of data.profiles) await put(STORES.PROFILES, p);
  }
  if (data.progress) {
    for (const r of data.progress) await put(STORES.PROGRESS, r);
  }
  if (data.questions) {
    await replaceAllQuestions(data.questions);
  }
  if (data.snapshots) {
    for (const s of data.snapshots) await setDoc(doc(fs, 'snapshots', s.id), s);
  }
}

export type { ProgressEntry } from './types';
