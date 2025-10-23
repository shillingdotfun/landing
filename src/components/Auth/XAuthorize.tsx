import React, { useState } from 'react';

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
  const { twitterAuthStatus, checkingTwitterAuth } = useClientAuthStatus(user);

  const { handleLoginWithX, isLoading: twitterLoading } = useTwitterAuth({
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
        return next;
      });
    },
  });

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
    <div className='grid grid-cols-2 gap-4 mb-8'>
      <GenericTextInput
        disabled={true}
        plain={true} 
        label='X account handler (without @)'
        name='x_handler'
        onChange={(e) => handleFormChange('x_username', e.target.value)}
        value={formState?.x_username ?? ''}
        className={`${formState?.x_username ? 'bg-green-200 text-green-500' : '!bg-slate-200'}`}
        containerClassName={'!mb-0'}
      />
      <div className='flex items-end'>
        <Button
          label={
            twitterAuthStatus
              ? 'Authorize another account'
              : user.settings?.x_username &&
                user.settings?.secrets.x_access_token &&
                user.settings?.secrets.x_access_token_secret
              ? 'Refresh authorization'
              : 'Authorize'
          }
          icon={<FaXTwitter />}
          onClick={handleLoginWithX}
          disabled={twitterLoading || checkingTwitterAuth}
          className='px-2'
        />
      </div>
    </div>
  );
};

export default XAuthorizeButton;
