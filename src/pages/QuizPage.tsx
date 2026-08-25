import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, HelpCircle, Send, Sparkles, XCircle } from 'lucide-react';
import { useApp } from '@/lib/context';
import { navigate } from '@/lib/router';
import { TopBar } from '@/components/TopBar';
import { DrawingCanvas, type DrawingCanvasHandle } from '@/components/DrawingCanvas';
import { getAllQuestions, addProgressEntry, markQuestionsSeen } from '@/lib/db';
import { checkAnswer, getModuleColor, shuffleArray } from '@/lib/utils';
import type { ModuleId, Question } from '@/lib/types';

export function QuizPage({ modul, kelas, level }: { modul: ModuleId; kelas: number; level: number }) {
  const { activeProfile } = useApp();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [reviews, setReviews] = useState<Record<number, boolean | undefined>>({});
  const [showReview, setShowReview] = useState(false);
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const c = getModuleColor(modul);
  useEffect(() => { getAllQuestions().then(all => { const filtered = shuffleArray(all.filter(q => q.modul === modul && q.kelas === kelas && q.level === level)).slice(0, 10); setQuestions(filtered); if (activeProfile && filtered.length > 0) { markQuestionsSeen(activeProfile.id, filtered.map(q => q.id)); } }); }, [modul, kelas, level, activeProfile]);
  const question = questions[index];
  const answer = answers[index] ?? '';
  const review = reviews[index];
  const isLast = index === questions.length - 1;
  const setAnswer = (value: string) => setAnswers((old) => ({ ...old, [index]: value }));

  const isDrawingQuestion = question && (question.tipe_soal === 'menyalin' || (question.tipe_soal === 'isian' && question.modul === 'menulis'));
  const canProceed = isDrawingQuestion ? review !== undefined : answer.trim().length > 0;

  function handleTeacherReview(approved: boolean) {
    setReviews((old) => ({ ...old, [index]: approved }));
    setShowReview(false);
  }

  function nextQuestion() {
    if (index < questions.length - 1) {
      setIndex(i => i + 1);
      setShowReview(false);
    }
  }

  async function finish() {
    if (!activeProfile) return;
    const benar = questions.reduce((sum, q, i) => {
      if (q.tipe_soal === 'menyalin' || (q.tipe_soal === 'isian' && q.modul === 'menulis')) {
        return sum + (reviews[i] === true ? 1 : 0);
      }
      return sum + (checkAnswer(answers[i] ?? '', q) ? 1 : 0);
    }, 0);
    const nilai = Math.round((benar / questions.length) * 100);
    await addProgressEntry(activeProfile.id, { modul, kelas, level, nilai, benar, salah: questions.length - benar, total: questions.length, completed_at: new Date().toISOString() });
    navigate('result', { modul, kelas: String(kelas), level: String(level), nilai: String(nilai), benar: String(benar), total: String(questions.length) });
  }

  if (!question) return <div className="min-h-screen bg-slate-50"><TopBar title="Latihan" back /><main className="max-w-lg mx-auto px-4 py-16 text-center"><HelpCircle className="w-12 h-12 text-slate-300 mx-auto" /><h1 className="text-xl font-black text-slate-700 mt-4">Belum ada soal untuk bab ini</h1><p className="text-slate-500 mt-2">Minta guru menambahkan soal melalui menu Drop Soal.</p><button onClick={() => navigate('module', { modul })} className="mt-6 px-5 py-3 rounded-xl bg-sky-500 text-white font-bold">Kembali ke modul</button></main></div>;

  return <div className="min-h-screen bg-slate-50"><TopBar title={`${modul} · Kelas ${kelas} Bab ${level}`} back />
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6"><div className="flex items-center justify-between mb-3"><span className={`text-sm font-bold ${c.text}`}>Soal {index + 1} dari {questions.length}</span><span className="flex items-center gap-1 text-xs font-semibold text-slate-400"><Clock3 className="w-4 h-4" /> Latihan mandiri</span></div><div className="h-2 rounded-full bg-slate-200 mb-6 overflow-hidden"><div className={`h-full rounded-full bg-gradient-to-r ${c.gradient} transition-all`} style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"><div className="p-6 sm:p-8">
        {question.teks_bacaan && (
          <div className="mb-6 p-6 sm:p-8 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-900 leading-loose text-2xl sm:text-3xl font-bold tracking-wide text-center">
            {question.teks_bacaan}
          </div>
        )}
        <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-3">
          {isDrawingQuestion ? 'Tulis dengan tangan di kanvas' : question.pilihan ? 'Pilih jawaban yang benar' : 'Tulis jawabanmu'}
        </p>
        <h1 className="text-2xl sm:text-3xl font-black leading-snug text-slate-800">{question.pertanyaan}</h1>
        <AnswerInput question={question} value={answer} onChange={setAnswer} color={c} canvasRef={canvasRef} isDrawing={isDrawingQuestion} />

        {isDrawingQuestion && (
          <div className="mt-6">
            {review === undefined && !showReview && (
              <button
                onClick={() => setShowReview(true)}
                className="w-full py-3.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Saya sudah selesai menulis
              </button>
            )}
            {showReview && review === undefined && (
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
                <p className="text-center font-black text-amber-800 text-lg mb-1">Penilaian Guru</p>
                <p className="text-center text-sm text-amber-700 mb-4">Apakah tulisan siswa sudah benar dan rapi?</p>
                <div className="flex gap-3">
                  <button onClick={() => handleTeacherReview(true)} className="flex-1 py-4 rounded-xl bg-emerald-500 text-white font-black text-lg hover:bg-emerald-600 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-6 h-6" /> Ya, Benar
                  </button>
                  <button onClick={() => handleTeacherReview(false)} className="flex-1 py-4 rounded-xl bg-rose-500 text-white font-black text-lg hover:bg-rose-600 flex items-center justify-center gap-2">
                    <XCircle className="w-6 h-6" /> Tidak, Salah
                  </button>
                </div>
              </div>
            )}
            {review !== undefined && (
              <div className={`rounded-2xl border-2 p-4 flex items-center gap-3 ${review ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
                {review ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <XCircle className="w-6 h-6 text-rose-600" />}
                <span className={`font-bold ${review ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {review ? 'Dinilai benar oleh guru' : 'Dinilai perlu perbaikan'}
                </span>
                <button onClick={() => { setReviews((old) => ({ ...old, [index]: undefined })); setShowReview(true); }} className="ml-auto text-sm font-bold text-slate-500 hover:text-slate-700">
                  Ubah
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-between gap-3">
          <button disabled={index === 0} onClick={() => setIndex(i => i - 1)} className="px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30"><ArrowLeft className="w-5 h-5 inline mr-1" /> Sebelumnya</button>
          {isLast ? <button onClick={finish} disabled={!canProceed} className="px-5 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-sm disabled:opacity-40"><Send className="w-4 h-4 inline mr-2" /> Selesai</button> : <button disabled={!canProceed} onClick={nextQuestion} className={`px-5 py-3 rounded-xl bg-gradient-to-r ${c.gradient} text-white font-bold disabled:opacity-40`}>Berikutnya <ArrowRight className="w-5 h-5 inline ml-1" /></button>}
        </div>
      </div></div>
      <p className="text-center text-xs text-slate-400 mt-4"><Sparkles className="w-3 h-3 inline mr-1" />Tidak perlu terburu-buru. Kerjakan dengan teliti.</p></main>
  </div>;
}

function AnswerInput({ question, value, onChange, color, canvasRef, isDrawing }: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  color: ReturnType<typeof getModuleColor>;
  canvasRef: React.RefObject<DrawingCanvasHandle>;
  isDrawing: boolean;
}) {
  if (isDrawing) {
    return (
      <div className="mt-7">
        <DrawingCanvas ref={canvasRef} color="#1e293b" />
        <p className="text-xs text-slate-400 mt-2"><Check className="w-3 h-3 inline" /> Tulis dengan jarimu di area putih. Setelah selesai, tekan tombol di bawah untuk guru menilai.</p>
      </div>
    );
  }
  if (question.pilihan) {
    return (
      <div className="grid sm:grid-cols-2 gap-3 mt-7">
        {question.pilihan.map((choice) => (
          <button key={choice} onClick={() => onChange(choice)} className={`text-left p-4 rounded-xl border-2 font-semibold text-lg transition-all ${value === choice ? `${color.bg} ${color.border} ${color.text}` : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
            <span className={`inline-flex w-8 h-8 rounded-lg items-center justify-center mr-2 text-sm font-bold ${value === choice ? 'bg-white/70' : 'bg-slate-100'}`}>{String.fromCharCode(65 + question.pilihan!.indexOf(choice))}</span>{choice}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-7">
      <input autoFocus value={value} onChange={(e) => onChange(e.target.value)} placeholder="Tulis jawabanmu di sini..." className="w-full px-4 py-4 text-xl rounded-xl border-2 border-slate-200 focus:outline-none focus:border-sky-400" />
      <p className="text-xs text-slate-400 mt-2"><Check className="w-3 h-3 inline" /> Jawablah dengan sebaik-baiknya.</p>
    </div>
  );
}
