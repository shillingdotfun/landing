
import { useState, useMemo } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { useLogout } from "@privy-io/react-auth";

import { User } from "../types/user.types";

import { getUserProfile } from "../services/user.service";
import { WalletService } from "../services/wallet.service";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { disconnect: disconnectSolana, connected } = useWallet();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { logout: privyLogout } = useLogout({
    onSuccess: () => {
      console.log('User successfully logged out');
    },
  });

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
      setError(null);
      localStorage.removeItem('token');
      
      // Clean up services
      const walletService = WalletService.getInstance();
      walletService.removeWalletAddr();

      if (connected) {
        await disconnectSolana();
      }
    } catch (error) {
      console.error('Privy error logging out:', error);
      setError('Error during logout');
    }
  };

  const value = useMemo(() => ({
    token,
    isAuthenticated: !!token,
    userProfile,
    loading,
    error,
    login,
    logout,
    loadUserProfile,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [token, userProfile, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};