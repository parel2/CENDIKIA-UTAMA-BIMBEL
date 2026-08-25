import { ArrowLeft, Home, LogOut, ShieldCheck } from 'lucide-react';
import { useApp } from '@/lib/context';
import { navigate } from '@/lib/router';

export function TopBar({ title, back = false, teacher = false }: { title: string; back?: boolean; teacher?: boolean }) {
  const { activeProfile, logout } = useApp();
  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
        {back ? (
          <button onClick={() => navigate(teacher ? 'teacher' : 'home')} className="p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-600" aria-label="Kembali">
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : <div className="w-9" />}
        <div className="flex-1">
          <button onClick={() => navigate(teacher ? 'teacher' : 'home')} className="font-black tracking-tight text-slate-800 text-lg">
            Rumah Belajar
          </button>
          {title && <span className="text-slate-400 text-sm ml-2 hidden sm:inline">/ {title}</span>}
        </div>
        {activeProfile && !teacher && (
          <button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800">
            <span className="text-xl">{activeProfile.avatar}</span>
            <span className="hidden sm:inline">{activeProfile.nama}</span>
            <LogOut className="w-4 h-4" />
          </button>
        )}
        {teacher && (
          <button onClick={() => navigate('home')} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800">
            <Home className="w-4 h-4" /> Murid
          </button>
        )}
      </div>
    </header>
  );
}

export function TeacherBadge() {
  return <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold"><ShieldCheck className="w-4 h-4" /> Mode Guru</div>;
}
