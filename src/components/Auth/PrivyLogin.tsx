import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { FaArrowRight } from 'react-icons/fa';

import { useAuth } from '../../hooks/useAuth';
import { useToasts } from '../../hooks/useToast';

import { registerOrLoginWithEmail, loginWithWallet } from '../../services/auth.service';

import Button from '../Common/Button';

const PrivyLogin: React.FC = () => {
  const { addNotification } = useToasts();
  const { login} = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    login: privyLogin,
    authenticated,
    ready,
    user,
    connectWallet,
    logout: privyLogout
  } = usePrivy();  

  const processUserLogin = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      if (user.email?.address) {
        const sessionToken = await registerOrLoginWithEmail(user.email.address);
        login(sessionToken);
        addNotification('Login successful!', 'success');
        navigate('/agent/character');

      } else if (user.wallet?.address) {
        const sessionToken = await loginWithWallet(user.wallet.address);
        login(sessionToken);
        addNotification('Login successful!', 'success');
        navigate('/agent/character');

      }
    } catch (err: any) {
      console.error('Connection error:', err);
      addNotification(err.message || 'Failed to connect', 'error');
      await privyLogout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ready && authenticated && user && (user.wallet?.address || user.email?.address)) {
      processUserLogin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated, user?.wallet?.address, user?.email?.address]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      if (!authenticated) {
        await privyLogin();
      } else if (user && !user.wallet?.address) {
        await connectWallet();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      addNotification(err.message || 'Failed to login', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button 
        onClick={handleLogin}
        label={isLoading ? 'Connecting...' : 'Login'}
        disabled={isLoading}
        icon={<FaArrowRight></FaArrowRight>}
      />
    </div>
  );
};

export default PrivyLogin;
