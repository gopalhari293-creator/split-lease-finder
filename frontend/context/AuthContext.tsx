'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoommateProfile } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  profile: RoommateProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfileState: (user: User, profile: RoommateProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<RoommateProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const data = await authService.getMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login({ email, password });
    await refreshUser();
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    await authService.register({ name, email, password, phone });
    await refreshUser();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
  };

  const updateProfileState = (updatedUser: User, updatedProfile: RoommateProfile) => {
    setUser(updatedUser);
    setProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
