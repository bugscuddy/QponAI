import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { apiService, UserResponse } from '../services/api';

interface AuthContextProps {
  user: UserResponse | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  initialized: false,

  login: async () => { },

  register: async () => { },

  logout: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Try to fetch the current user on mount to check if tokens exist
    (async () => {
      try {
        const currentUser = await apiService.getCurrentUser();
        setUser(currentUser);
      } catch {
        console.log('No existing session');
      } finally {
        setInitialized(true);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await apiService.login(email, password);
      setUser(loggedInUser);
    } catch (error: any) {
      Alert.alert('Login Error', error.message || 'Failed to login');
      throw error;
    }
  };

  const register = async (email: string, password: string, phone?: string) => {
    try {
      const registeredUser = await apiService.register(email, password, phone);
      setUser(registeredUser);
    } catch (error: any) {
      Alert.alert('Registration Error', error.message || 'Failed to register');
      throw error;
    }
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initialized, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
