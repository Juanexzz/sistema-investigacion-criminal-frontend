'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { User } from '../domain/user';
import { authService, LoginPayload, RegisterPayload } from '../services/auth.service';
import { TOKEN_COOKIE_NAME } from '../../common/config/api.config';
import { ApiError } from '../../common/domain/api-error';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_OVERRIDE_KEY = 'crime_report_user_override';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSetCookie = (token: string) => {
    Cookies.set(TOKEN_COOKIE_NAME, token, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: 1, // 1 día (alineado a JWT_EXPIRES_IN=1d)
    });
  };

  const rehydrate = useCallback(async () => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      let mergedUser = currentUser;

      if (typeof window !== 'undefined') {
        const storedOverride = localStorage.getItem(USER_OVERRIDE_KEY);
        if (storedOverride) {
          try {
            const parsed = JSON.parse(storedOverride);
            if (parsed.id === currentUser.id) {
              mergedUser = { ...currentUser, ...parsed };
            }
          } catch {
            localStorage.removeItem(USER_OVERRIDE_KEY);
          }
        }
      }

      setUser(mergedUser);
    } catch {
      Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  const login = async (credentials: LoginPayload): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(credentials);
      handleSetCookie(result.token);
      setUser(result.user);
      router.push('/cases');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.register(payload);
      handleSetCookie(result.token);
      setUser(result.user);
      router.push('/cases');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Error al completar el registro');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_OVERRIDE_KEY);
    }
    setUser(null);
    router.push('/login');
  };

  const updateUser = (partial: Partial<User>): void => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partial };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(USER_OVERRIDE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
