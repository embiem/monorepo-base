'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { JWTPayload } from '@monorepo/shared';
import jwt_decode from 'jwt-decode';

interface AuthContextType {
  user: JWTPayload | null;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setAccessToken: () => {},
  clearAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JWTPayload | null>(null);

  const setAccessToken = (token: string) => {
    localStorage.setItem('accessToken', token);
    const decoded = jwt_decode<JWTPayload>(token);
    setUser(decoded);
  };

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwt_decode<JWTPayload>(token);
        setUser(decoded);
      } catch (error) {
        clearAuth();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setAccessToken, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);