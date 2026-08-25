import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Calculator, CheckCircle2, Lock, PenLine, Settings2, Star, TrendingUp } from 'lucide-react';
import { useApp } from '@/lib/context';
import { navigate } from '@/lib/router';
import { TopBar } from '@/components/TopBar';
import { ModuleIcon } from '@/components/ModuleIcon';
import { getModuleColor } from '@/lib/utils';
import { getProfileProgress, type ProgressEntry } from '@/lib/db';
import type { ModuleId } from '@/lib/types';

export function StudentHome() {
  const { activeProfile } = useApp();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  useEffect(() => { if (activeProfile) { getProfileProgress(activeProfile.id).then(setProgress); } }, [activeProfile]);
  if (!activeProfile) return null;
  const completed = progress.filter((p) => p.nilai >= 70).length;
  const average = progress.length ? Math.round(progress.reduce((a, p) => a + p.nilai, 0) / progress.length) : 0;
  return (
    <div className="min-h-screen bg-slate-50"><TopBar title="Beranda" />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 p-6 sm:p-8 text-white shadow-xl shadow-sky-100 mb-8">
          <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full border-[24px] border-white/10" /><div className="absolute right-16 -bottom-20 w-44 h-44 rounded-full border-[20px] border-white/10" />
          <div className="relative"><div className="text-4xl mb-3">{activeProfile.avatar}</div><p className="text-white/80 font-semibold">Selamat datang kembali,</p><h1 className="text-3xl sm:text-4xl font-black tracking-tight">{activeProfile.nama}!</h1><p className="mt-3 text-white/90 max-w-md">Pilih pelajaran dan lanjutkan petualangan belajarmu hari ini.</p></div>
          <div className="relative flex flex-wrap gap-3 mt-7"><div className="px-4 py-2 rounded-xl bg-white/15 border border-white/20"><span className="block text-2xl font-black">{completed}</span><span className="text-xs text-white/80">Bab selesai</span></div><div className="px-4 py-2 rounded-xl bg-white/15 border border-white/20"><span className="block text-2xl font-black">{average || '-'}</span><span className="text-xs text-white/80">Nilai rata-rata</span></div></div>
        </section>
        <div className="flex items-end justify-between mb-4"><div><p className="text-sm font-bold text-sky-600 uppercase tracking-wider">Perjalananmu</p><h2 className="text-2xl font-black text-slate-800">Mau belajar apa?</h2></div><TrendingUp className="w-7 h-7 text-emerald-500" /></div>
        <div className="grid md:grid-cols-3 gap-4">
          {(['membaca', 'menulis', 'berhitung'] as ModuleId[]).map((modul) => { const c = getModuleColor(modul); const last = progress.filter((p) => p.modul === modul).sort((a, b) => b.completed_at.localeCompare(a.completed_at))[0]; return <button key={modul} onClick={() => navigate('module', { modul })} className={`text-left bg-white rounded-2xl border ${c.border} p-5 hover:shadow-lg hover:-translate-y-1 transition-all group`}><div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-105 transition-transform`}><ModuleIcon name={modul === 'membaca' ? 'BookOpen' : modul === 'menulis' ? 'PenLine' : 'Calculator'} className="w-7 h-7" /></div><h3 className="font-black text-xl text-slate-800 capitalize">{modul}</h3><p className="text-sm text-slate-500 mt-1">{modul === 'membaca' ? 'Kenali kata dan pahami cerita' : modul === 'menulis' ? 'Latih tangan dan susun kalimat' : 'Asah logika dan angka'}</p><div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100"><span className={`text-sm font-bold ${c.text}`}>{last ? `Terakhir: ${last.nilai}` : 'Mulai dari kelas 1'}</span><ArrowRight className={`w-5 h-5 ${c.text} group-hover:translate-x-1 transition-transform`} /></div></button>; })}
        </div>
        <section className="mt-8 bg-white rounded-2xl border border-slate-200 p-5"><div className="flex items-center justify-between mb-4"><div><h2 className="font-black text-slate-800">Lencana belajarmu</h2><p className="text-sm text-slate-500">Terus berlatih untuk membuka semua!</p></div><Star className="w-7 h-7 text-amber-400 fill-amber-400" /></div><div className="flex gap-4 overflow-x-auto pb-1"><Badge icon={<BookOpen />} label="Pembaca" unlocked={progress.some(p => p.modul === 'membaca')} /><Badge icon={<PenLine />} label="Penulis" unlocked={progress.some(p => p.modul === 'menulis')} /><Badge icon={<Calculator />} label="Jago Angka" unlocked={progress.some(p => p.modul === 'berhitung')} /><Badge icon={<CheckCircle2 />} label="Nilai 100" unlocked={progress.some(p => p.nilai === 100)} /></div></section>
        <button onClick={() => navigate('teacher-login')} className="flex items-center gap-2 mx-auto mt-8 text-xs text-slate-400 hover:text-slate-600"><Settings2 className="w-4 h-4" /> Menu guru</button>
      </main>
    </div>
  );
}

function Badge({ icon, label, unlocked }: { icon: React.ReactNode; label: string; unlocked: boolean }) { return <div className={`min-w-[92px] text-center ${unlocked ? 'text-amber-600' : 'text-slate-300'}`}><div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${unlocked ? 'bg-amber-100' : 'bg-slate-100'}`}>{unlocked ? icon : <Lock className="w-5 h-5" />}</div><p className="text-xs font-bold mt-2">{label}</p></div>; }
