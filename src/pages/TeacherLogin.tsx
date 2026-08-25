import { useState } from 'react';
import { ArrowRight, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { navigate } from '@/lib/router';
import { TopBar } from '@/components/TopBar';
import { TEACHER_CODE } from '@/lib/types';

export function TeacherLogin() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  function submit() { if (code === TEACHER_CODE) { sessionStorage.setItem('teacherAccess', 'yes'); navigate('teacher'); } else setError('Kode belum benar. Coba lagi.'); }
  return <div className="min-h-screen bg-slate-50"><TopBar title="Masuk guru" back /><main className="max-w-md mx-auto px-4 py-16"><div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm text-center"><div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-5"><ShieldCheck className="w-8 h-8" /></div><h1 className="text-2xl font-black text-slate-800">Ruang Guru</h1><p className="text-slate-500 mt-2 mb-7">Masukkan kode sederhana untuk membuka menu guru.</p><div className="relative"><KeyRound className="absolute left-4 top-4 w-5 h-5 text-slate-400" /><input type="password" inputMode="numeric" maxLength={8} autoFocus value={code} onChange={(e) => { setCode(e.target.value); setError(''); }} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="Kode guru" className="w-full px-12 py-3.5 rounded-xl border border-slate-200 text-center tracking-[.4em] focus:outline-none focus:ring-2 focus:ring-rose-400" /></div>{error && <p className="text-rose-600 text-sm font-semibold mt-3">{error}</p>}<button onClick={submit} className="w-full mt-5 py-3.5 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600">Buka ruang guru <ArrowRight className="w-4 h-4 inline ml-1" /></button><p className="text-xs text-slate-400 mt-5"><LockKeyhole className="w-3 h-3 inline mr-1" />Kode awal: 1234 (bisa diubah di pengaturan nanti)</p></div></main></div>;
}
