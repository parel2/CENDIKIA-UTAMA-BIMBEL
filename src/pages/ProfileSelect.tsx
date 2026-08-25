import { useState } from 'react';
import { ArrowRight, BookOpen, GraduationCap, Plus, Sparkles } from 'lucide-react';
import { useApp, AVATARS } from '@/lib/context';
import { navigate } from '@/lib/router';
import { Modal } from '@/components/Modal';
import { TopBar } from '@/components/TopBar';

export function ProfileSelect() {
  const { profiles, selectProfile, createProfile, loading } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');

  if (loading) return <LoadingScreen />;

  async function handleCreate() {
    const clean = name.trim();
    if (clean.length < 2) {
      setError('Nama minimal 2 huruf ya.');
      return;
    }
    await createProfile(clean, avatar);
    setName('');
    setShowCreate(false);
    navigate('home');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="Pilih profil" />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-200 mb-6 rotate-2">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <p className="text-sky-600 font-bold tracking-wide uppercase text-sm mb-2">Rumah Belajar</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">Siapa yang mau belajar?</h1>
          <p className="text-slate-500 mt-3">Pilih namamu untuk melihat perjalanan belajar.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {profiles.map((profile) => (
            <button key={profile.id} onClick={() => { selectProfile(profile.id); navigate('home'); }} className="group bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-sky-300 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{profile.avatar}</div>
              <div className="font-bold text-slate-700 truncate">{profile.nama}</div>
            </button>
          ))}
          <button onClick={() => setShowCreate(true)} className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center hover:border-sky-400 hover:bg-sky-50 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><Plus className="w-6 h-6" /></div>
            <div className="font-bold text-slate-600">Buat profil</div>
          </button>
        </div>
        <button onClick={() => navigate('teacher-login')} className="flex items-center gap-2 mx-auto mt-12 text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">
          <GraduationCap className="w-4 h-4" /> Masuk sebagai guru <ArrowRight className="w-4 h-4" />
        </button>
      </main>
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Buat profil baru">
        <div className="space-y-5">
          <div><label className="block text-sm font-bold text-slate-700 mb-2">Nama panggilan</label><input autoFocus value={name} onChange={(e) => { setName(e.target.value); setError(''); }} placeholder="Contoh: Budi" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400" />{error && <p className="text-rose-600 text-sm mt-2">{error}</p>}</div>
          <div><label className="block text-sm font-bold text-slate-700 mb-2">Pilih teman</label><div className="flex flex-wrap gap-2">{AVATARS.map((a) => <button key={a} onClick={() => setAvatar(a)} className={`text-3xl p-2 rounded-xl ${avatar === a ? 'bg-sky-100 ring-2 ring-sky-400' : 'hover:bg-slate-100'}`}>{a}</button>)}</div></div>
          <button onClick={handleCreate} className="w-full py-3.5 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 active:scale-[.98] transition-all">Mulai belajar</button>
        </div>
      </Modal>
    </div>
  );
}

function LoadingScreen() { return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-center"><Sparkles className="w-8 h-8 text-sky-500 mx-auto animate-pulse" /><p className="mt-3 text-slate-500 font-semibold">Menyiapkan rumah belajar...</p></div></div>; }
