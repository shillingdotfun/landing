// src/services/WalletAddrService.ts

import { USER_WALLET_ADDR_STORAGE_KEY } from "../utils/constants";

export class WalletService {
  private static instance: WalletService | null = null;

  static getInstance(): WalletService {
    if (!WalletService.instance) {
        WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  private constructor() {}

  saveWalletAddr(walletAddr: string): void {
    localStorage.setItem(USER_WALLET_ADDR_STORAGE_KEY, walletAddr);
  }

  removeWalletAddr(): void {
    localStorage.removeItem(USER_WALLET_ADDR_STORAGE_KEY);
  }
}
