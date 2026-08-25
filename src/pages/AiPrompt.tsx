import { useState } from 'react';
import { Check, Copy, FileJson, Lightbulb, Wand2 } from 'lucide-react';
import { TopBar } from '@/components/TopBar';

const MODULE_OPTIONS = [
  { value: 'membaca', label: 'Membaca' },
  { value: 'menulis', label: 'Menulis' },
  { value: 'berhitung', label: 'Berhitung' },
];

const KELAS_OPTIONS = [1, 2, 3, 4, 5];
const LEVEL_OPTIONS = [1, 2, 3, 4, 5];
const JUMLAH_OPTIONS = [5, 10, 15, 20];

export function AiPrompt() {
  const [modul, setModul] = useState('berhitung');
  const [kelas, setKelas] = useState(1);
  const [level, setLevel] = useState(1);
  const [topik, setTopik] = useState('');
  const [jumlah, setJumlah] = useState(10);
  const [materi, setMateri] = useState('');
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const prompt = buildPrompt(modul, kelas, level, topik, jumlah, materi);
  const canGenerate = topik.trim().length > 0 && materi.trim().length > 0;

  async function copy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleGenerate() {
    setGenerated(true);
    setCopied(false);
  }

  function handleReset() {
    setGenerated(false);
    setCopied(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="Prompt AI untuk Guru" back teacher />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-7">
        <div className="max-w-2xl mb-6">
          <p className="text-sm font-bold text-amber-600 uppercase tracking-wide">Bantuan membuat materi</p>
          <h1 className="text-3xl font-black text-slate-800 mt-1">Buat Prompt AI siap pakai</h1>
          <p className="text-slate-500 mt-2">Isi form di bawah, lalu klik tombol untuk membuat prompt. Tinggal salin dan tempel ke ChatGPT atau Claude.</p>
        </div>

        {!generated ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Modul Ajar">
                <select value={modul} onChange={(e) => setModul(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-amber-400">
                  {MODULE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label="Kelas">
                <select value={kelas} onChange={(e) => setKelas(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-amber-400">
                  {KELAS_OPTIONS.map((k) => <option key={k} value={k}>Kelas {k}</option>)}
                </select>
              </Field>
              <Field label="Tingkat Kesulitan (Bab)">
                <select value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-amber-400">
                  {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>Bab {l}</option>)}
                </select>
              </Field>
              <Field label="Jumlah Soal">
                <select value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-amber-400">
                  {JUMLAH_OPTIONS.map((j) => <option key={j} value={j}>{j} soal</option>)}
                </select>
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Topik / Tema">
                <input value={topik} onChange={(e) => setTopik(e.target.value)} placeholder="Contoh: Penjumlahan, Huruf vokal, Cerita hewan" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 focus:outline-none focus:border-amber-400" />
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Materi Pelajaran">
                <textarea value={materi} onChange={(e) => setMateri(e.target.value)} placeholder="Tulis atau tempel materi pelajaran di sini. Contoh: Penjumlahan 1-20, pengenalan huruf A-Z, dll." rows={6} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 focus:outline-none focus:border-amber-400 resize-none" />
              </Field>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="mt-6 w-full py-4 rounded-xl bg-amber-500 text-white font-black text-lg hover:bg-amber-600 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Wand2 className="w-5 h-5" /> Berikan Prompt
            </button>
            {!canGenerate && (
              <p className="text-center text-sm text-slate-400 mt-2">Isi topik dan materi terlebih dahulu</p>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_280px] gap-5">
            <section className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-5 py-3 bg-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                  <FileJson className="w-4 h-4 text-amber-400" /> Prompt siap salin
                </div>
                <button onClick={copy} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/20">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Tersalin' : 'Salin prompt'}
                </button>
              </div>
              <pre className="p-5 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap overflow-auto max-h-[620px]">{prompt}</pre>
            </section>
            <aside className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <Lightbulb className="w-6 h-6 text-amber-500 mb-3" />
                <h2 className="font-black text-amber-900">Cara menggunakan</h2>
                <ol className="mt-3 space-y-3 text-sm text-amber-800">
                  <li><b>1.</b> Salin prompt di samping.</li>
                  <li><b>2.</b> Tempel ke ChatGPT, Claude, atau AI lain.</li>
                  <li><b>3.</b> Salin hasil JSON dari AI.</li>
                  <li><b>4.</b> Tempel di halaman Drop Soal.</li>
                </ol>
              </div>
              <button onClick={handleReset} className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50">
                Buat prompt baru
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-black text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function buildPrompt(modul: string, kelas: number, level: number, topik: string, jumlah: number, materi: string): string {
  const modulLabel = MODULE_OPTIONS.find((m) => m.value === modul)?.label ?? modul;
  return `Kamu adalah pembuat soal calistung untuk murid SD kelas ${kelas}.

TUGAS:
Ubah materi mentah yang saya berikan menjadi JSON array berisi ${jumlah} soal latihan. Jangan menulis penjelasan di luar JSON.

ATURAN:
1. Modul: "${modul}" (${modulLabel}).
2. Kelas: ${kelas}, tingkat kesulitan (level): ${level}.
3. Topik: ${topik}.
4. Gunakan tipe_soal tepat: "pilihan_ganda", "isian", "menyalin", atau "pemahaman".
5. Setiap soal wajib punya: modul, kelas, level, tipe_soal, pertanyaan, jawaban_benar.
6. Untuk pilihan_ganda, wajib ada pilihan berupa array berisi 4 string. jawaban_benar harus sama persis dengan salah satu pilihan.
7. Untuk pemahaman, tambahkan teks_bacaan sebelum pertanyaan.
8. Untuk menulis, gunakan kata_kunci berupa array jawaban yang bisa diterima jika diperlukan.
9. Tambahkan penjelasan singkat untuk membantu guru menjelaskan jawaban.
10. Buat soal yang ramah anak, jelas, dan sesuai murid SD kelas ${kelas}.
11. Untuk soal berhitung kelas rendah (1-2), gunakan emoji benda (apel, bintang, dll) agar lebih menarik.
12. Untuk soal berhitung kelas atas (3-5), gunakan soal cerita yang dekat dengan kehidupan anak.
13. Untuk soal membaca, buat teks_bacaan yang menarik dan sesuai usia.
14. Jangan gunakan code fence markdown. Keluarkan JSON murni yang bisa langsung ditempel ke aplikasi.

CONTOH FORMAT:
[
  {
    "modul": "berhitung",
    "kelas": 3,
    "level": 2,
    "tipe_soal": "pilihan_ganda",
    "pertanyaan": "Berapakah hasil dari 24 + 18?",
    "pilihan": ["32", "42", "44", "40"],
    "jawaban_benar": "42",
    "penjelasan": "24 + 18 = 42"
  },
  {
    "modul": "membaca",
    "kelas": 2,
    "level": 1,
    "tipe_soal": "pemahaman",
    "teks_bacaan": "Siti merawat bunga di halaman rumah.",
    "pertanyaan": "Apa yang dirawat Siti?",
    "pilihan": ["Bunga", "Kucing", "Sepeda", "Buku"],
    "jawaban_benar": "Bunga",
    "penjelasan": "Teks menyebutkan Siti merawat bunga."
  }
]

MATERI MENTAH DARI GURU:
${materi}

Buat ${jumlah} soal dari materi tersebut.`;
}
