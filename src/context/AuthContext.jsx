import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

import { api } from '../api/client';



export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('asinetkw_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
      } catch {
        sessionStorage.removeItem('asinetkw_user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.token || !user?.role) {
        setProfile(null);
        return;
      }

      try {
        if (user.role === 'mahasiswa') {
          const p = await api.get(`/mahasiswa/user/${user.id}`, user.token);
          setProfile(p);
        } else if (user.role === 'dosen') {
          const p = await api.get(`/dosen/user/${user.id}`, user.token);
          setProfile(p);
        } else {
          setProfile(null);
        }
      } catch {
        setProfile(null);
      }
    }
    loadProfile();
  }, [user]);

  async function login(email, password) {
    try {
      const result = await api.post('/auth/login', { email, password });

      if (!result?.token) return { success: false, message: result?.message || 'Login gagal' };

      const nextUser = {
        token: result.token,
        id: result.user.id,
        role: result.user.role,
        name: result.user.name,
        email: result.user.email,
      };

      sessionStorage.setItem('asinetkw_user', JSON.stringify(nextUser));
      setUser(nextUser);

      return { success: true, role: nextUser.role };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  function logout() {
    sessionStorage.removeItem('asinetkw_user');
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


