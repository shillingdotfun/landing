// src/hooks/useTwitterAuth.ts
import { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import { useToasts } from '../useToast';

interface TwitterAuthState {
  isReturningFromTwitter: boolean;
  twitterUsername: string | null | undefined;
  twitterUserId: number | null | undefined;
  twitterAuthSuccess: boolean;
  twitterAuthError: boolean;
}

interface UseTwitterAuthOptions {
  onAuthSuccess?: (username: string | null | undefined, userId: number) => void;
  onTokensReceived?: (accessToken: string, accessTokenSecret: string) => void;
}

interface UseTwitterAuthReturn {
  authState: TwitterAuthState;
  isLoading: boolean;
  handleLoginWithX: () => Promise<void>;
  handleGetAgentXSecrets: (userId: number) => Promise<void>;
  markAsProcessed: () => void;
}

export const useTwitterAuth = (options: UseTwitterAuthOptions = {}): UseTwitterAuthReturn => {
  const {
    onAuthSuccess,
    onTokensReceived
  } = options;

  const { userProfile } = useAuth();
  const { addNotification } = useToasts();
  
  const [authState, setAuthState] = useState<TwitterAuthState>({
    isReturningFromTwitter: false,
    twitterUsername: null,
    twitterUserId: null,
    twitterAuthSuccess: false,
    twitterAuthError: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Check URL parameters when hook initializes
  useEffect(() => {
    const checkTwitterAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authSuccess = urlParams.get('twitter_auth_success') === 'true';
      const authError = urlParams.get('twitter_auth_error') === 'true';
      const screenName = urlParams.get('twitter_screen_name');
      const userId = urlParams.get('x_user_id');
      
      if (authSuccess || authError) {
        setAuthState({
          isReturningFromTwitter: true,
          twitterUsername: screenName,
          twitterUserId: userId ? Number(userId) : null,
          twitterAuthSuccess: authSuccess,
          twitterAuthError: authError,
        });
      }
    };
    
    checkTwitterAuth();
  }, []);

  // Mark as processed to avoid duplicate processing
  const markAsProcessed = () => {
    setAuthState(prev => ({
      ...prev,
      isReturningFromTwitter: false
    }));
    
    // Clear URL parameters
    const url = new URL(window.location.href);
    url.searchParams.delete('twitter_auth_success');
    url.searchParams.delete('twitter_auth_error');
    url.searchParams.delete('twitter_screen_name');
    url.searchParams.delete('x_user_id');
    
    window.history.replaceState({}, document.title, url.toString());    
  };

  // Handle Twitter authentication response
  useEffect(() => {
    const { twitterAuthSuccess, twitterAuthError, twitterUserId, twitterUsername, isReturningFromTwitter } = authState;
    
    if (!isReturningFromTwitter) return;
    
    if (twitterAuthError) {
      addNotification('Something went wrong with your X account', 'error');
      markAsProcessed();
    }

    if (twitterAuthSuccess && twitterUserId) {
      if (onAuthSuccess) {
        onAuthSuccess(twitterUsername, twitterUserId);
      }
      handleGetAgentXSecrets(twitterUserId);
      markAsProcessed();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState, onAuthSuccess]);

  // Login with X/Twitter
  const handleLoginWithX = async () => {
    if (!userProfile?.id) {
      addNotification('User not authenticated', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const currentUrl = window.location.href;
      const response = await fetch(
        `${process.env.HOST}:${process.env.PORT}/api/x/gen-auth-link?userId=${userProfile.id}&returnUrl=${encodeURIComponent(currentUrl)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'ok' && data.data && data.data.url) {
        window.location.href = data.data.url;
      } else {
        console.error('Unexpected response:', data);
        addNotification('Error connecting to X. Please try again.', 'error');
        markAsProcessed();
      }
    } catch (error) {
      console.error('Error in X authentication:', error);
      addNotification('Connection error. Please try again later.', 'error');
      markAsProcessed();
    } finally {
      setIsLoading(false);
    }
  };

  // Get X/Twitter tokens
  const handleGetAgentXSecrets = async (userId: number) => {
    setIsLoading(true);
    
    try {
      const payload = {
        'x_user_id': userId,
      };
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get-twitter-tokens`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      
      if (!response.ok) {
        addNotification('Something went wrong updating your agent secrets, please try again', 'error');
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const jsonRes = await response.json();
      
      if (jsonRes.data.access_secret && jsonRes.data.access_token) {
        if (onTokensReceived) {
          onTokensReceived(jsonRes.data.access_token, jsonRes.data.access_secret);
        }
      }
    } catch (error) {
      console.error('Error getting X secrets:', error);
      addNotification('Failed to retrieve X authentication tokens', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    authState,
    isLoading,
    handleLoginWithX,
    handleGetAgentXSecrets,
    markAsProcessed
  };
};