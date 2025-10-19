
import { useState, useMemo, useRef, useEffect } from "react";

import { useLogout } from "@privy-io/react-auth";

import { User } from "../types/user.types";

import { getUserProfile } from "../services/user.service";
import { WalletService } from "../services/wallet.service";
import { AuthContext } from "./AuthContext";

export type SessionStatus = 'unknown' | 'valid' | 'invalid';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('unknown');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const validatingRef = useRef(false);
  const { logout: privyLogout } = useLogout({
    onSuccess: () => {
      console.log('User successfully logged out');
    },
  });

  const validateSession = async () => {
    if (!token) {
      setSessionStatus('invalid');
      setUserProfile(null);
      return;
    }
    if (validatingRef.current) return;
    validatingRef.current = true;
    setError(null);
    setLoading(true);
    try {
      const res = await getUserProfile(); // should fail with 401 if the token is not valid
      setUserProfile(res.data ?? null);
      setSessionStatus('valid');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      setSessionStatus('invalid');
      setUserProfile(null);
    } finally {
      setLoading(false);
      validatingRef.current = false;
    }
  };

  useEffect(() => {
    setSessionStatus('unknown');
    void validateSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadUserProfile = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getUserProfile();
      if (res.data) {
        setUserProfile(res.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    loadUserProfile(); // Load profile after login
  };

  const logout = async () => {
    try {
      await privyLogout();
      console.log('User logout OK');
      setToken(null);
      setUserProfile(null);
      setSessionStatus('invalid');
      setError(null);
      localStorage.removeItem('token');
      
      // Clean up services
      const walletService = WalletService.getInstance();
      walletService.removeWalletAddr();
    } catch (error) {
      console.error('Privy error logging out:', error);
      setError('Error during logout');
    }
  };

  const value = useMemo(() => ({
    token,
    isAuthenticated: !!token && sessionStatus === 'valid',
    sessionStatus,
    userProfile,
    loading,
    error,
    login,
    logout,
    loadUserProfile,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [token, sessionStatus, userProfile, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};