export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string | null;
  password?: string;
  walletAddress?: string | null;
  created_at: string;
  updated_at: string;
  anon: boolean;
  settings: UserSettings;
}

export type UserUpdatePayload = Partial<Pick<User, 
  'name' | 'email' | 'walletAddress' | 'anon' | 'settings' | 'settings'
>>;

export interface UserSettings {
  secrets: UserSettingsSecrets,
  // X Settings
  x_user_id?: number,
  x_username?: string,
};

export interface UserSettingsSecrets {
  // X
  x_access_token?: string,
  x_access_token_secret?: string,
}

export type PathsToStringProps<T> = T extends object
  ? { [K in keyof T]-?: K extends string
      ? T[K] extends object
        ? `${K}.${PathsToStringProps<T[K]>}` | K
        : K
      : never
    }[keyof T]
  : never;


export type TypeFromPath<T, P extends string> = 
  P extends keyof T
    ? T[P]
    : P extends `${infer K}.${infer R}`
      ? K extends keyof T
        ? TypeFromPath<T[K], R>
        : never
      : never;

export function setValueByPath<T extends object, P extends PathsToStringProps<T>>(
  obj: T, 
  path: P, 
  value: TypeFromPath<T, P>
): T {
  if (!path) return obj;
  
  const pathParts = path.split('.');
  const [first, ...rest] = pathParts;
  
  if (rest.length === 0) {
    // Caso base: estamos en el último nivel
    return { ...obj, [first]: value };
  } else {
    // Caso recursivo: seguimos profundizando
    const key = first as keyof T;
    const nextObj = obj[key] as any || {};
    return {
      ...obj,
      [key]: setValueByPath(nextObj, rest.join('.') as any, value)
    };
  }
}
