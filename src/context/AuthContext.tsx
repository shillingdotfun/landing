// src/context/AuthContext.tsx
import { createContext } from 'react';
import { User } from '../types/user.types';


interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
  login: (token: string) => void;
  logout: () => void;
  loadUserProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  userProfile: null,
  loading: false,
  error: null,
  login: () => {},
  logout: () => {},
  loadUserProfile: async () => {},
});
