import { useEffect, useState } from 'react';
import { AppProvider, useApp } from '@/lib/context';
import { useRoute } from '@/lib/router';
import { ProfileSelect } from '@/pages/ProfileSelect';
import { StudentHome } from '@/pages/StudentHome';
import { ModulePage } from '@/pages/ModulePage';
import { QuizPage } from '@/pages/QuizPage';
import { ResultPage } from '@/pages/ResultPage';
import { TeacherLogin } from '@/pages/TeacherLogin';
import { TeacherDashboard } from '@/pages/TeacherDashboard';
import { DropSoal } from '@/pages/DropSoal';
import { AiPrompt } from '@/pages/AiPrompt';
import type { ModuleId } from '@/lib/types';

function AppContent() {
  const { activeProfile, loading } = useApp();
  const route = useRoute();
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  if (loading) return null;
  let page: React.ReactNode;
  const routeName = route.name;
  if (routeName === 'teacher-login') page = <TeacherLogin />;
  else if (routeName === 'teacher') page = sessionStorage.getItem('teacherAccess') === 'yes' ? <TeacherDashboard /> : <TeacherLogin />;
  else if (routeName === 'drop-soal') page = sessionStorage.getItem('teacherAccess') === 'yes' ? <DropSoal /> : <TeacherLogin />;
  else if (routeName === 'ai-prompt') page = sessionStorage.getItem('teacherAccess') === 'yes' ? <AiPrompt /> : <TeacherLogin />;
  else if (!activeProfile) page = <ProfileSelect />;
  else if (routeName === 'module') page = <ModulePage modul={(route.params?.modul ?? 'membaca') as ModuleId} />;
  else if (routeName === 'quiz') page = <QuizPage modul={(route.params?.modul ?? 'membaca') as ModuleId} kelas={Number(route.params?.kelas ?? 1)} level={Number(route.params?.level ?? 1)} />;
  else if (routeName === 'result') page = <ResultPage modul={(route.params?.modul ?? 'membaca') as ModuleId} kelas={Number(route.params?.kelas ?? 1)} level={Number(route.params?.level ?? 1)} nilai={Number(route.params?.nilai ?? 0)} benar={Number(route.params?.benar ?? 0)} total={Number(route.params?.total ?? 0)} />;
  else page = <StudentHome />;
  return (
    <>
      {offline && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
          Sedang offline — soal dan nilai butuh internet untuk tersimpan
        </div>
      )}
      {page}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
export default App;
