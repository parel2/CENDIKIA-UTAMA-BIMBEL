import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Profile } from './types';
import * as db from './db';
import { ensureSeedData } from './init';

interface AppContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  loading: boolean;
  refreshProfiles: () => Promise<void>;
  selectProfile: (id: string) => void;
  createProfile: (nama: string, avatar: string) => Promise<Profile>;
  removeProfile: (id: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const AVATARS = ['🐱', '🐶', '🐰', '🦊', '🐼', '🦁', '🐸', '🐵', '🦉', '🐧'];

export function AppProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfiles = useCallback(async () => {
    const all = await db.getAllProfiles();
    setProfiles(all);
  }, []);

  useEffect(() => {
    (async () => {
      await ensureSeedData();
      await refreshProfiles();
      const stored = localStorage.getItem('activeProfileId');
      if (stored) {
        const p = await db.getProfile(stored);
        if (p) setActiveProfile(p);
      }
      setLoading(false);
    })();
  }, [refreshProfiles]);

  const selectProfile = useCallback((id: string) => {
    const p = profiles.find((x) => x.id === id);
    if (p) {
      setActiveProfile(p);
      localStorage.setItem('activeProfileId', id);
    }
  }, [profiles]);

  const createProfile = useCallback(async (nama: string, avatar: string) => {
    const profile: Profile = {
      id: crypto.randomUUID(),
      nama,
      avatar,
      created_at: new Date().toISOString(),
    };
    await db.saveProfile(profile);
    await refreshProfiles();
    setActiveProfile(profile);
    localStorage.setItem('activeProfileId', profile.id);
    return profile;
  }, [refreshProfiles]);

  const removeProfile = useCallback(async (id: string) => {
    await db.deleteProfile(id);
    if (activeProfile?.id === id) {
      setActiveProfile(null);
      localStorage.removeItem('activeProfileId');
    }
    await refreshProfiles();
  }, [refreshProfiles, activeProfile]);

  const logout = useCallback(() => {
    setActiveProfile(null);
    localStorage.removeItem('activeProfileId');
  }, []);

  return (
    <AppContext.Provider
      value={{
        profiles,
        activeProfile,
        loading,
        refreshProfiles,
        selectProfile,
        createProfile,
        removeProfile,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { AVATARS };
