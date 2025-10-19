import api from "./api";
import { User, UserUpdatePayload } from "../types/user.types";

export interface UserShowResponse {
    success: boolean,
    message: string,
    data?: User,
}

export const getUserProfile = async (): Promise<UserShowResponse> => {
  return await api.get('/user');
};

export interface UserUpdateResponse {
    success: boolean,
    message: string,
    data?: User,
    errors?: UserUpdateResponseError,
}

export interface UserUpdateResponseError {
  [field: string]: string[];
}

export  const updateUserProfile = async (payload: UserUpdatePayload): Promise<UserUpdateResponse> => {
    return await api.put('/user', payload);
};
