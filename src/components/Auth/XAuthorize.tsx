import React, { useEffect, useState } from 'react';

import Button from '../Common/Button';
import { PathsToStringProps, setValueByPath, TypeFromPath, User, UserSettings, UserUpdatePayload } from '../../types/user.types';
import useClientAuthStatus from '../../hooks/user/useClientAuthStatus';
import { useTwitterAuth } from '../../hooks/user/useTwitterAuth';
import { FaXTwitter } from 'react-icons/fa6';
import GenericTextInput from '../Common/inputs/GenericTextInput';

interface PrivyLoginButtonProps {
  user: User;
  onAuth: (field: keyof UserUpdatePayload, value: string|boolean|any) => void;
}

const XAuthorizeButton: React.FC<PrivyLoginButtonProps> = ({ 
  user,
  onAuth
}) => {
  const [formState, setFormState] = useState<UserSettings>({...user.settings,});
  const { twitterAuthStatus, checkingTwitterAuth, forceRecheck } = useClientAuthStatus(user);
  const { handleLoginWithX, isLoading: twitterLognAttemptLoading } = useTwitterAuth({
    onAuthSuccess: (username, userId) => {
      if (userId && username) {
        setFormState(prev => {
          const newState = {
            ...prev,
            x_user_id: userId,
            x_username: username,
          };
          return newState;
        });
      }
    },
    onTokensReceived: (accessToken, accessTokenSecret) => {
      setFormState(prev => {
        const next = {
          ...prev,
          secrets: {
            ...(prev.secrets ?? {}),
            x_access_token: accessToken,
            x_access_token_secret: accessTokenSecret,
          },
        };
        onAuth('settings', next);
        onAuth('name', next.x_username);
        return next;
      });
    },
  });

  useEffect(() => {
    if (user) {
      forceRecheck(user)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Twitter auth validation
  const handleFormChange = <P extends PathsToStringProps<UserSettings>>(
    path: P, 
    value: TypeFromPath<UserSettings, P>
  ) => {
    setFormState(prev => {
      const baseCopy = JSON.parse(JSON.stringify(prev));
      return setValueByPath(baseCopy, path, value); // Simplify this
    });
  };

  return (
    <div className='grid grid-cols-1'>
      <div className='mb-2'>
        <p className='text-sm'>Authorized X account</p>
        <p className='text-xs'>Your X handler is used for verification purposes</p>
      </div>
      <div className='grid grid-cols-2 gap-4 mb-8 items-end'>
        <GenericTextInput
          disabled={true}
          plain={true} 
          name='x_handler'
          onChange={(e) => handleFormChange('x_username', e.target.value)}
          value={formState?.x_username ?? ''}
          className={`${formState?.x_username && twitterAuthStatus ? 'bg-green-300 text-green-600' : ''}`}
          containerClassName={'!mb-0'}
        />
        <Button
          label={twitterAuthStatus ? 'Verified' : 'Verify'}
          icon={<FaXTwitter />}
          onClick={handleLoginWithX}
          disabled={twitterLognAttemptLoading || checkingTwitterAuth || twitterAuthStatus}
        />
      </div>
    </div>
  );
};

export default XAuthorizeButton;
