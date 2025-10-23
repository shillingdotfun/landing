// src/pages/PrivateProfile.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { ConnectedStandardSolanaWallet, useWallets } from '@privy-io/react-auth/solana';
import { FaBoltLightning, FaEnvelope, FaUser } from "react-icons/fa6";

import { UserUpdatePayload } from '../types/user.types';

import { getTokenBalanceForCurrentToken } from '../utils/web3/getTokenBalanceForCurrentToken';

import { useAuth } from '../hooks/useAuth';
import { useToasts } from '../hooks/useToast';
import { usePrivyLinkManager } from '../hooks/usePrivyLinkManager';
import { useUpdateUserProfile } from '../hooks/user/useUpdateUserProfile';

import solanaLogoWhite from '../assets/images/solana-white.svg';

import Button from '../components/Common/Button';
import GenericTextInput from '../components/Common/inputs/GenericTextInput';
import ContentBlock from '../components/Common/layouts/ContentBlock';
import Loader from '../components/Common/Loader';
import GenericCheckboxInput from '../components/Common/inputs/GenericCheckboxInput';
import XAuthorizeButton from '../components/Auth/XAuthorize';

const PrivateProfile: React.FC = () => {
  // Privy hooks 
  const { user: privyUser, ready: privyReady, authenticated: privyAuthenticated } = usePrivy();
  const { wallets, ready } = useWallets();
  const hasWallet = ready && wallets.some((wallet: ConnectedStandardSolanaWallet) => wallet.address);
  const { linkWallet, linkEmail, unlinkWallet, updateEmail } = usePrivyLinkManager({
    onWalletLinked: async (newAddress) => {
      const old = userProfile?.walletAddress;
      if (old && old !== newAddress) await unlinkWallet(old);
      await handleUpdateUser({ walletAddress: newAddress });
    },
    onEmailLinked: async (email) => {
      await handleUpdateUser({ email });
    },
    onEmailUpdated: async (email) => {
      if (email !== userProfile?.email) {
        await handleUpdateUser({ email });
      }
    },
    onError: (kind, err) => {
      addNotification(kind === 'email' ? 'Failed to link email' : 'Failed to link wallet', 'error');
      console.error('Privy link error', err);
    },
  });
  // End Privy hooks 
  
  const { addNotification } = useToasts();
  const { userProfile, isAuthenticated, loadUserProfile, loading, error } = useAuth();
  const { response, handleUpdateUser, clearFieldError } = useUpdateUserProfile();
  
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [connectWalletButtonLabel, setConnectWalletButtonLabel] = useState<string>()
  const [profileData, setProfileData] = useState<UserUpdatePayload>({
    name: '',
    email: '',
    anon: false,
  });
  
  useEffect(() => {
    if (!userProfile) {
      loadUserProfile();
    } else {
      setProfileData({
        name: userProfile.name ?? '',
        email: userProfile.email ?? '',
        anon: userProfile.anon ?? false,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    if (response?.message) {
      addNotification(response.message, response?.success ? "success" : "error");
      if (response.success) {
        loadUserProfile();
        setPendingChanges(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  useEffect(() => {
    if (error) addNotification(error, "error");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    const fetchBalance = async () => {
      const walletAddress = userProfile?.walletAddress || privyUser?.wallet?.address;
      if (walletAddress ) {
        try {
          const balance = await getTokenBalanceForCurrentToken(walletAddress);
          setTokenBalance(balance.uiBalance);
        } catch (error) {
          console.error('Error fetching token balance:', error);
        }
      }
    };
    if (hasWallet) fetchBalance();

    if (userProfile?.walletAddress) {
      if (!hasWallet) {
        setConnectWalletButtonLabel('re-Authorize wallet')
      } else {
        setConnectWalletButtonLabel('Change wallet')
      }
    } else {
      setConnectWalletButtonLabel('Connect wallet');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.walletAddress, hasWallet]);

  const handleSubmit = async () => {
    handleUpdateUser(profileData);
  };

  const handleInputChange = (field: keyof UserUpdatePayload, value: string|boolean|any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setPendingChanges(true);
    if (response?.errors?.[field]) {
      clearFieldError(field);
    }
  };

  // Email handler with Privy
  const handleEmailWithPrivy = async () => {
    try {
      if (!privyReady || !privyAuthenticated) {
        addNotification('Please log in to manage your email', 'error');
        return;
      }
      
      if (privyUser?.email?.address) {
        await updateEmail();
      } else {
        await linkEmail();
      }
    } catch (e: any) {
      console.error('Privy email operation failed:', e);
      addNotification(e?.message || 'Could not update/link email with Privy', 'error');
    }
  }

  // Wallet handler with Privy
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
        try { await anyWin.solana.disconnect(); } catch {
          console.error('Error disconnecting wallet')
        }
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

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (!userProfile) {
    return (
      <Loader loadingText='Loading profile' />
    );
  }

  return (
    <div className='sm:grid sm:grid-cols-2 flex flex-col gap-4'>
      <div className='flex flex-col gap-4'>
        <ContentBlock
          title='Profile Settings'
        >
          <div className='grid grid-cols-2 gap-4'>
            { /* name */ }
            <div>
              <GenericTextInput
                label="Public name"
                iconSource={<FaUser/>}
                value={!profileData.anon && profileData.settings?.x_username ? profileData.settings?.x_username : profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                plain={true}
                disabled={!profileData.anon}
                hasError={!!response?.errors?.name}
                errorMessages={response?.errors?.name}
              />
              <p className='text-xs -mt-2 mb-6'>* This name will be displayed instead of your X handle if you enable <b>"Show as anon"</b></p>
            </div>
            { /* email */ }
            <div>
              <GenericTextInput
                className='cursor-pointer'
                label="Email"
                iconSource={<FaEnvelope/>}
                value={privyUser?.email?.address || 'Soon!'}
                onChange={() => { /* noop: handled by Privy */ }}
                plain={true}
                readOnly
                disabled={true}
                onClick={handleEmailWithPrivy}
                hasError={!!response?.errors?.email}
                errorMessages={response?.errors?.email}
              />
            </div>
          </div>

          <XAuthorizeButton user={userProfile} onAuth={handleInputChange}/>

          { /* anon */ }
          <GenericCheckboxInput
            label='Show as anon'
            checked={profileData.anon}
            onChange={(e) => handleInputChange('anon', e.target.checked)}
          />
          <p className='text-xs -mt-2 mb-6'>Don't show my identity anywhere</p>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            blinker={pendingChanges}
            label={loading ? 'Saving...' : 'Save Changes'}
          />
        </ContentBlock>
      </div>

      <div className='flex flex-col gap-4'>
        <ContentBlock
          title='Wallet Settings'
        >
          <div className='flex flex-col justify-between h-full'>
            <div>
              {userProfile?.walletAddress && (
                <div className='flex flex-row items-center gap-2 rounded-md bg-input-light mb-6'>
                  {hasWallet && (() => {
                    const w = wallets.find((w) => w.address === userProfile.walletAddress);
                    if (!w) return null;
                    // En Solana el identificador del proveedor es `provider`:
                    const key = (w.standardWallet.name || '').toLowerCase(); // p.ej. 'phantom'
                    const iconSrc = w.standardWallet.icon;
                    return iconSrc ? <img src={iconSrc} alt={key} className="h-5 w-5 rounded" /> : null;
                  })()}
                  <span className='font-afacad text-md'>
                    {userProfile.walletAddress}
                  </span>
                </div>
              )}

              <Button
                label={connectWalletButtonLabel}
                onClick={handleWalletWithPrivy}
                className=''
                blinker={!userProfile?.walletAddress || !hasWallet}
                disabled={loading}
              />
            </div>
          </div>
        </ContentBlock>
        <ContentBlock 
          title='Karma points and balance'
          className='h-fit bg-gradient-to-r from-purple-500 to-blue-500 sm:from-purple-500/50 sm:to-blue-500/50'
        >
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div className="bg-yellow-400 text-black flex flex-row rounded-lg">
              <div className="ml-[18px] flex h-[70px] w-auto flex-row items-center">
                <div className="rounded-full sm:p-3">
                  <FaBoltLightning className="text-[24px]"/>
                </div>
              </div>
              <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                <p className="font-dm text-sm font-medium font-anek-latin">Karma points</p>
                <h4 className="text-xl font-bold font-anek-latin">0</h4>
              </div>
            </div>

            <div className="bg-slate-100/30 flex flex-row rounded-lg text-white">
              <div className="ml-[18px] flex h-[70px] w-auto flex-row items-center">
                <div className="rounded-full sm:p-3">
                  <img src={solanaLogoWhite} className="h-[24px]" alt="SOL logo"/>
                </div>
              </div>
              <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                <p className="font-dm text-sm font-medium font-anek-latin">{import.meta.env.VITE_TOKEN_MINT_TOKEN_SYMBOL} balance</p>
                <h4 className="text-xl font-bold font-anek-latin">{tokenBalance ? Number.parseFloat(tokenBalance.toString()).toFixed(4) : '--'}</h4>
              </div>
            </div>
          </div>
        </ContentBlock>
      </div>
    </div>
  );
};

export default PrivateProfile;
