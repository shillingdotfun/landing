// src/services/authService.ts
import api from './api';
import { WalletService } from './wallet.service';

interface AuthData {
  email?: string | null;
  wallet_address?: string | null;
  name?: string;
}

/**
 * Enhanced wallet login with email linking support in our backend
 */
export const loginWithWallet = async (walletAddress: string, email?: string) => {
  const payload: any = { wallet_address: walletAddress };
  if (email) payload.email = email;
  
  const response = await api.post('/wallet-login', payload);
  
  if (response.data.user.wallet_address) {
    const walletService = WalletService.getInstance();
    walletService.saveWalletAddr(response.data.user.wallet_address);
  }
  
  return response.data.token;
};

/**
 * Enhanced email login with wallet linking support in our backend
 */
export const registerOrLoginWithEmail = async (emailAddress: string, walletAddress?: string) => {
  const payload: any = { email: emailAddress };
  if (walletAddress) payload.wallet_address = walletAddress;
  
  const response = await api.post('/external-email-login', payload);
  
  if (response.data.wallet_address) {
    const walletService = WalletService.getInstance();
    walletService.saveWalletAddr(response.data.wallet_address);
  }

  return response.data.token;
};

/**
 * Unified authentication method that handles smart user linking. TODO: Migrate to this
 */
export const authenticateUser = async (authData: AuthData) => {
  const response = await api.post('/unified-auth', authData);
  
  // Handle response and store tokens/keys
  const userData = response.data.user;
  const token = response.data.token;
  
  if (userData?.wallet_address) {
    const walletService = WalletService.getInstance();
    walletService.saveWalletAddr(userData.wallet_address);
  }
  
  return token;
};