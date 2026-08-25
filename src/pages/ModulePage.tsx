import { useEffect, useState } from 'react';
import { CheckCircle2, Trophy } from 'lucide-react';
import { useApp } from '@/lib/context';
import { navigate } from '@/lib/router';
import { TopBar } from '@/components/TopBar';
import { ModuleIcon } from '@/components/ModuleIcon';
import { getModuleColor } from '@/lib/utils';
import { getAllQuestions, getProfileProgress, getNewQuestionKeys, type ProgressEntry } from '@/lib/db';
import type { ModuleId } from '@/lib/types';

export function ModulePage({ modul }: { modul: ModuleId }) {
  const { activeProfile } = useApp();
  const [questions, setQuestions] = useState<Awaited<ReturnType<typeof getAllQuestions>>>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set());
  const c = getModuleColor(modul);
  useEffect(() => {
    if (activeProfile) {
      getAllQuestions().then(setQuestions);
      getProfileProgress(activeProfile.id).then(setProgress);
      getNewQuestionKeys(activeProfile.id).then(setNewKeys);
    }
  }, [activeProfile]);
  const completed = (kelas: number, level: number) => progress.find(p => p.modul === modul && p.kelas === kelas && p.level === level);
  return <div className="min-h-screen bg-slate-50"><TopBar title={modul} back />
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className={`rounded-3xl bg-gradient-to-br ${c.gradient} p-6 sm:p-8 text-white mb-8 shadow-lg`}><div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-5"><ModuleIcon name={modul === 'membaca' ? 'BookOpen' : modul === 'menulis' ? 'PenLine' : 'Calculator'} className="w-8 h-8" /></div><p className="text-white/80 font-bold uppercase text-sm tracking-wide">Modul belajar</p><h1 className="text-3xl font-black capitalize mt-1">{modul}</h1><p className="mt-2 text-white/85">Pilih bab mana pun untuk mulai belajar. Semua bab terbuka!</p></div>
      <div className="space-y-3">{[1,2,3,4,5].map((kelas) => <div key={kelas} className="bg-white border border-slate-200 rounded-2xl overflow-hidden"><div className="px-5 py-4 flex items-center justify-between"><div><p className="text-xs uppercase tracking-wide font-bold text-slate-400">Tingkat</p><h2 className="text-lg font-black text-slate-800">Kelas {kelas}</h2></div><span className="text-sm font-semibold text-slate-400">{[1,2,3,4,5].filter(level => questions.some(q => q.modul === modul && q.kelas === kelas && q.level === level)).length || (kelas === 1 ? 5 : 0)} bab</span></div><div className="px-5 pb-5 grid grid-cols-5 gap-2">{[1,2,3,4,5].map(level => {
        const key = `${modul}:${kelas}:${level}`;
        const record = completed(kelas, level);
        const hasQuestions = questions.some(q => q.modul === modul && q.kelas === kelas && q.level === level);
        const visible = hasQuestions || (kelas === 1 && level === 1);
        const isNew = newKeys.has(key);
        return <button key={level} disabled={!visible} onClick={() => navigate('quiz', { modul, kelas: String(kelas), level: String(level) })} className={`relative rounded-xl py-3 text-center border transition-all ${record?.nilai && record.nilai >= 70 ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : visible ? `${c.bg} ${c.border} ${c.text} hover:shadow-md` : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'}`}><span className="block text-xs font-bold">Bab</span><span className="text-lg font-black">{level}</span>{record?.nilai && record.nilai >= 70 ? <CheckCircle2 className="w-3.5 h-3.5 absolute top-1 right-1" /> : null}{isNew && visible ? <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse" /> : null}</button>; })}</div></div>)}</div>
      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl p-4"><Trophy className="w-5 h-5 text-amber-500" /><span>Semua bab terbuka. Kerjakan sesuai urutan atau lompat ke bab mana pun yang kamu mau!</span></div>
    </main>
  </div>;
}
