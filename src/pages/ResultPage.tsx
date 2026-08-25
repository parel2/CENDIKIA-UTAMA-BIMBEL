import { ArrowLeft, ArrowRight, CheckCircle2, Home, RotateCcw, Sparkles, Target, XCircle } from 'lucide-react';
import { navigate } from '@/lib/router';
import { TopBar } from '@/components/TopBar';
import { getNextBab } from '@/lib/utils';
import type { ModuleId } from '@/lib/types';

export function ResultPage({ modul, kelas, level, nilai, benar, total }: { modul: ModuleId; kelas: number; level: number; nilai: number; benar: number; total: number }) {
  const next = getNextBab(modul, kelas, level);
  return <div className="min-h-screen bg-slate-50"><TopBar title="Hasil latihan" />
    <main className="max-w-lg mx-auto px-4 py-8"><div className="rounded-3xl p-7 text-center text-white bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl"><div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5"><CheckCircle2 className="w-11 h-11" /></div><p className="font-bold text-white/80 uppercase tracking-wide text-sm">Latihan selesai</p><h1 className="text-3xl font-black mt-1">Hebat sekali!</h1><div className="text-7xl font-black mt-6 tracking-tight">{nilai}</div><p className="text-white/80 font-semibold">Nilai kamu</p></div>
      <div className="grid grid-cols-3 gap-3 my-5"><Stat icon={<CheckCircle2 />} value={`${benar}`} label="Benar" tone="emerald" /><Stat icon={<XCircle />} value={`${total - benar}`} label="Perlu latihan" tone="rose" /><Stat icon={<Target />} value={`${total}`} label="Total soal" tone="sky" /></div>
      <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center"><Sparkles className="w-7 h-7 mx-auto mb-2 text-emerald-500" /><p className="font-bold text-slate-800">{next ? 'Lanjut ke bab berikutnya!' : 'Kamu sudah menyelesaikan semua bab!'}</p><p className="text-sm text-slate-500 mt-1">{next ? `Kelas ${next.kelas} Bab ${next.level} sudah menunggu.` : 'Kamu hebat sekali, semua bab selesai!'}</p></div>
      <div className="space-y-3 mt-5">
        {next && <button onClick={() => navigate('quiz', { modul, kelas: String(next.kelas), level: String(next.level) })} className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-sm flex items-center justify-center gap-2">Lanjut ke Bab {next.level} <ArrowRight className="w-5 h-5" /></button>}
        <button onClick={() => navigate('quiz', { modul, kelas: String(kelas), level: String(level) })} className="w-full py-3.5 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Coba lagi</button>
        <button onClick={() => navigate('module', { modul })} className="w-full py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> Lihat modul {modul}</button>
        <button onClick={() => navigate('home')} className="w-full py-3.5 rounded-xl text-slate-500 font-bold hover:bg-white flex items-center justify-center gap-2"><Home className="w-4 h-4" /> Kembali ke beranda</button>
      </div>
    </main></div>;
}
function Stat({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: string }) { return <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center"><div className={`text-${tone}-500 flex justify-center mb-1`}>{icon}</div><div className="font-black text-xl text-slate-800">{value}</div><div className="text-xs text-slate-400 font-semibold">{label}</div></div>; }
