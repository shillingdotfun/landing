// src/components/agent/buttons/web3/solana/SolanaPaymentWall.tsx
import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, type ConnectedStandardSolanaWallet } from '@privy-io/react-auth/solana';
import { FaQrcode, FaBoltLightning, FaArrowRotateRight } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';

import { useAuth } from '../../hooks/useAuth';
import { useToasts } from '../../hooks/useToast';
import { usePrivyLinkManager } from '../../hooks/usePrivyLinkManager';
import { useUpdateUserProfile } from '../../hooks/user/useUpdateUserProfile';
import { useSolanaPayment } from '../../hooks/solana/useSolanaPayment';

import Button from '../Common/Button';
import useIsMobile from '../../hooks/useIsMobile';

import logo from '../../assets/images/shilling-logo/large/purple-transparent.png'

interface Props {
  amount: string;
  description: string;
  orderId: string;
  symbol: string;
  onSuccess?: (signature: string) => void;
  onError?: (error: string) => void;
}

export const SolanaPaymentWall: React.FC<Props> = ({
  amount,
  description,
  orderId,
  symbol,
  onSuccess,
  onError,
}) => {
  const isMobile = useIsMobile();
  const { userProfile, loadUserProfile } = useAuth();
  const { addNotification } = useToasts();
  const { handleUpdateUser } = useUpdateUserProfile();
  
  // Privy hooks
  const { ready: privyReady, authenticated: privyAuthenticated } = usePrivy();
  const { wallets, ready } = useWallets();
  const hasWallet = ready && wallets.filter((wallet: ConnectedStandardSolanaWallet) => wallet.address).length > 0;

  const { linkWallet, unlinkWallet } = usePrivyLinkManager({
    onWalletLinked: async (newAddress: string) => {
      const old = userProfile?.walletAddress;
      if (old && old !== newAddress) await unlinkWallet(old);
      await handleUpdateUser({ walletAddress: newAddress });
      addNotification('Wallet connected successfully', 'success');
      // Reload user profile to get updated data
      setTimeout(() => {
        loadUserProfile();
      }, 1000);
    },
    onError: (_kind: any, err: any) => {
      addNotification('Failed to link wallet', 'error');
      console.error('Privy link error', err);
    },
  });

  const [resetKey, setResetKey] = useState(0);
  const [showError, setShowError] = useState(true);

  const {
    createPaymentRequest,
    createMobilePayment,
    directPayment,
    isLoading,
    error,
    qrCode,
  } = useSolanaPayment();

  const handleQRPayment = async () => {
    setShowError(true);
    await createPaymentRequest({
      amount,
      description,
      orderId,
      onSuccess,
      onError,
    });
  };

  const handleMobilePayment = async () => {
    setShowError(true);
    await createMobilePayment({
      amount,
      description,
      orderId,
      onSuccess,
      onError,
    });
  };

  const handleDirectPayment = async () => {
    setShowError(true);
    await directPayment({
      amount,
      description,
      orderId,
      onSuccess,
      onError,
    });
  };

  // Wallet handler with Privy - Same functionality as ProfilePage
  const handleWalletWithPrivy = async () => {
    if (!privyReady || !privyAuthenticated) {
      addNotification('Please log in to manage your wallet', 'error');
      return;
    }

    try {
      // 1) VERY IMPORTANT WITH Phantom: closes the dapp session,
      // so the next link forces to re-confirm and the user is able to change account
      const anyWin = window as any;
      if (anyWin?.solana?.isPhantom && anyWin.solana.disconnect) {
        try { 
          await anyWin.solana.disconnect(); 
        } catch { /* empty */ }
        // little pause to allow phantom closes
        await new Promise((r) => setTimeout(r, 150));
      }
      // 2) Link new wallet
      await linkWallet();

    } catch (e: any) {
      console.error('Replace wallet failed', e);
      addNotification(e?.message ?? 'Could not replace wallet', 'error');
    }
  };

  // Function to completely reset the component
  const handleReset = () => {
    setResetKey((k) => k + 1); // This forces a complete re-mount
    setShowError(false);
  };

  if (!hasWallet) {
    return (
      <div className="flex flex-row items-center justify-center">
        <Button
          label={userProfile?.walletAddress ? 're-Authorize wallet' : 'Connect wallet'}
          onClick={handleWalletWithPrivy}
        />
      </div>
    );
  }

  return (
    <div key={resetKey} className="solana-payment-container">
      <div className='flex flex-row justify-center -mt-4 mb-8 rounded-md'>
        <img src={logo} className='h-14'/>
      </div>

      <div className="flex flex-col gap-2 bg-slate-50 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-xl text-slate-500 mb-4">Pay with {symbol}</h3>
        <p className="font-bold bg-green-200 text-green-600 rounded-md px-2 py-1">{amount} {symbol}</p>
        <p className="font-thin text-slate-500 ">{description}</p>
      </div>

      {/* Only show buttons if no visible error */}
      {!(error && showError) && (
        <div>
          {isMobile ? (
            <div className="flex sm:flex-row flex-col gap-4 justify-center">
              <Button
                onClick={handleMobilePayment}
                icon={<FaQrcode />}
                label={isLoading ? 'Opening Wallet...' : 'Pay with My Wallet'}
                disabled={isLoading}
                className={`${isLoading ? 'cursor-not-allowed' : ''} justify-center`}
              />
              <Button
                onClick={handleDirectPayment}
                icon={<FaBoltLightning />}
                label={isLoading ? 'Processing...' : 'Pay Direct'}
                disabled={isLoading || qrCode !== null}
                className={`${isLoading || qrCode !== null ? 'cursor-not-allowed' : ''} justify-center`}
              />
              <Button
                onClick={() => window.location.reload()}
                icon={<FaTimes />}
                label="Cancel"
                className={`${isLoading || qrCode === null ? '!hidden' : ''} justify-center`}
              />
            </div>
          ) : (
            <div className="flex flex-row gap-4 justify-center">
              <Button
                onClick={handleQRPayment}
                icon={<FaQrcode />}
                label={isLoading ? 'Processing...' : 'Pay with QR'}
                disabled={isLoading || qrCode !== null}
                className={isLoading || qrCode !== null ? 'cursor-not-allowed' : ''}
              />
              <Button
                onClick={handleDirectPayment}
                icon={<FaBoltLightning />}
                label={isLoading ? 'Processing...' : 'Pay Direct'}
                disabled={isLoading || qrCode !== null}
                className={isLoading || qrCode !== null ? 'cursor-not-allowed' : ''}
              />
              <Button
                onClick={() => window.location.reload()}
                icon={<FaTimes />}
                label="Cancel"
                className={`${isLoading || qrCode === null ? '!hidden' : ''}`}
              />
            </div>
          )}
        </div>
      )}

      {/* Show error and retry button */}
      {error && showError && (
        <div className="error-container">
          <div className="flex flex-row items-center gap-2 font-anek-latin my-4 bg-red-100 p-4 text-red-500">
            <FaTimes /> {error}
          </div>

          <div className="mt-4 flex justify-center">
            <Button onClick={handleReset} icon={<FaArrowRotateRight />} label="Try Again" />
          </div>
        </div>
      )}

      {/* Only show QR if no visible error */}
      {qrCode && !isMobile && !(error && showError) && (
        <div className="qr-container mt-4 text-center p-4 bg-white rounded-lg flex flex-col items-center">
          <p className='font-anek-latin text-lg'>
            Scan with your mobile wallet this code to pay automatically
          </p>
          
          <div className='border border-1 w-full my-8 relative flex flex-row'>
            <span className='bg-slate-200 h-4 w-4 -top-2 -left-1 inline-block rounded-full absolute'></span>
            <span className='bg-slate-200 h-4 w-4 -top-2 -right-1 inline-block rounded-full absolute'></span>
          </div>
          
          <img src={qrCode} alt="QR Code for payment" className="rounded" />

          <div className='border border-1 w-full my-8 relative flex flex-row'>
            <span className='bg-slate-200 h-4 w-4 -top-2 -left-1 inline-block rounded-full absolute'></span>
            <span className='bg-slate-200 h-4 w-4 -top-2 -right-1 inline-block rounded-full absolute'></span>
          </div>
        </div>
      )}
    </div>
  );
};
