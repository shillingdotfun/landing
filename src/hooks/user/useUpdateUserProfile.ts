import { useState } from 'react';
import { UserUpdateResponse, updateUserProfile, UserUpdateResponseError } from '../../services/user.service';
import { UserUpdatePayload } from '../../types/user.types';

export const useUpdateUserProfile = () => {
  const [response, setResponse] = useState<UserUpdateResponse | null>(null);

  const handleUpdateUser = async (payload: UserUpdatePayload) => {
    const res = await updateUserProfile(payload);
    setResponse(res);
  };

  const clearFieldError = (field: keyof UserUpdateResponseError) => {
    setResponse(prev => {
      if (!prev?.errors?.[field]) return prev;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...restErrors } = prev.errors;

      return {
        ...prev,
        errors: Object.keys(restErrors).length > 0 ? restErrors : undefined,
      };
    });
  };

  const clearAllErrors = () => {
    setResponse(prev => {
      if (!prev?.errors) return prev;
      return {
        ...prev,
        errors: undefined,
      };
    });
  };

  return {
    response,
    handleUpdateUser,
    clearFieldError,
    clearAllErrors,
  };
};
