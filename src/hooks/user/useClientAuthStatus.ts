import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "../../types/user.types";

export async function isTwitterAuthorized(user: User): Promise<boolean> {
  const { x_access_token, x_access_token_secret } = user.settings.secrets;

  if (!x_access_token || !x_access_token_secret) {
    return false;
  }

  const res = await fetch(`${process.env.HOST}:${process.env.PORT}/api/check-twitter-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      x_access_token: x_access_token,
      x_access_token_secret: x_access_token_secret,
    }),
  });

  const data = await res.json();

  if (data.success) {
    return true;
  } else {
    return false;
  }
}

const useClientAuthStatus = (user: User) => {
  const [twitterAuthStatus, setTwitterAuthStatus] = useState<boolean | null>(null);
  const [checkingTwitterAuth, setCheckingTwitterAuth] = useState(false);
  
  const isCheckingRef = useRef(false);
  const lastCheckDataRef = useRef<string>('');

  const checkTwitterAuthWithData = useCallback(async (user?: User) => {
    
    const dataHash = JSON.stringify({
      username: user?.settings?.x_username,
      userId: user?.settings?.x_user_id,
      hasToken: !!user?.settings?.secrets?.x_access_token,
      hasSecret: !!user?.settings?.secrets?.x_access_token_secret
    });

    if (isCheckingRef.current || lastCheckDataRef.current === dataHash) {
      return twitterAuthStatus;
    }

    lastCheckDataRef.current = dataHash;

    const hasBasicCredentials = !!(
      user?.settings?.x_username &&
      user?.settings?.x_user_id &&
      user?.settings?.secrets?.x_access_token &&
      user?.settings?.secrets?.x_access_token_secret
    );

    if (!hasBasicCredentials) {
      setTwitterAuthStatus(false);
      return false;
    }

    isCheckingRef.current = true;
    setCheckingTwitterAuth(true);
    
    try {
      const isAuthorized = await isTwitterAuthorized(user);
      setTwitterAuthStatus(isAuthorized);
      return isAuthorized;
    } catch (error) {
      console.error('Error checking Twitter auth:', error);
      setTwitterAuthStatus(false);
      return false;
    } finally {
      isCheckingRef.current = false;
      setCheckingTwitterAuth(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkTwitterAuthFromDefinitionData = useCallback(async (user: User) => {
    return await checkTwitterAuthWithData(user);
  }, [checkTwitterAuthWithData]);

  const forceRecheck = useCallback(async (user: User) => {
    lastCheckDataRef.current = ''; // Clean cache
    return await checkTwitterAuthWithData(user);
  }, [checkTwitterAuthWithData]);

  useEffect(() => {
    checkTwitterAuthWithData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  return { 
    twitterAuthStatus, 
    checkingTwitterAuth, 
    checkTwitterAuthFromDefinitionData,
    forceRecheck
  };
};

export default useClientAuthStatus;