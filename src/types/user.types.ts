export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string | null;
  password?: string;
  walletAddress?: string | null;
  created_at: string;
  updated_at: string;
}

export type UserUpdatePayload = Partial<Pick<User, 
  'name' | 'email' | 'walletAddress'
>>;