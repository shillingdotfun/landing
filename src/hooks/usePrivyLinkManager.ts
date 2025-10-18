// src/hooks/privy/usePrivyLinkManager.ts
import { useRef, useCallback } from 'react';
import { useLinkAccount, useUpdateAccount, usePrivy } from '@privy-io/react-auth';

type Kind = 'wallet' | 'email' | 'updateEmail';

type Options = {
  onWalletLinked: (address: string) => Promise<void> | void;
  onEmailLinked?: (email: string) => Promise<void> | void;
  onEmailUpdated?: (email: string) => Promise<void> | void;
  getCurrentEmail?: () => string | undefined;
  onError?: (kind: Kind, error: unknown) => void;
};

export function usePrivyLinkManager(opts: Options) {
  const { unlinkWallet } = usePrivy();
  const pendingRef = useRef<Exclude<Kind, 'updateEmail'> | null>(null);

  const { linkWallet: linkWalletRaw, linkEmail: linkEmailRaw } = useLinkAccount({
    onSuccess: async ({ linkedAccount, user }) => {
      // 1) Intenta usar lo que marcamos en pendingRef
      let kind = pendingRef.current as 'wallet' | 'email' | null;

      // 2) Fallback robusto por si pendingRef llegó a null
      if (!kind && linkedAccount?.type === 'wallet') kind = 'wallet';
      if (!kind && linkedAccount?.type === 'email')  kind = 'email';

      // Limpia SIEMPRE aquí (no en finally de los wrappers)
      pendingRef.current = null;

      if (kind === 'wallet') {
        if (linkedAccount?.type === 'wallet' && linkedAccount.address) {
          await opts.onWalletLinked(linkedAccount.address);
        }
        return;
      }

      if (kind === 'email') {
        const email = user?.email?.address?.trim();
        if (email && opts.onEmailLinked) {
          await opts.onEmailLinked(email);
        }
      }
    },
    onError: (err) => {
      const kind = (pendingRef.current ?? 'wallet') as 'wallet' | 'email';
      pendingRef.current = null;

      const msg = String((err as any)?.message || err || '');
      if (/exited|close|cancel/i.test(msg)) return; // usuario canceló

      opts.onError?.(kind, err);
    },
  });

  // NO limpiar en finally -> evita la carrera con onSuccess
  const linkWallet = useCallback(async () => {
    pendingRef.current = 'wallet';
    await linkWalletRaw();
  }, [linkWalletRaw]);

  const linkEmail = useCallback(async () => {
    pendingRef.current = 'email';
    await linkEmailRaw();
  }, [linkEmailRaw]);

  const { updateEmail: updateEmailRaw } = useUpdateAccount({
    onSuccess: async ({ user }) => {
      const next = user?.email?.address?.trim();
      if (!next) return;

      if (opts.getCurrentEmail && opts.getCurrentEmail() === next) return; // sin cambios

      if (opts.onEmailUpdated) {
        await opts.onEmailUpdated(next);
      }
    },
    onError: (error) => {
      const code = typeof error === 'string' ? error : undefined;
      const msg = (error as any)?.message ?? String(error ?? '');
      if (code === 'exited_update_flow' || /exited|close|cancel/i.test(msg)) return;
      opts.onError?.('updateEmail', error);
    },
  });

  const updateEmail = useCallback(async () => {
    await updateEmailRaw();
  }, [updateEmailRaw]);

  return {
    linkWallet,
    linkEmail,
    updateEmail,
    unlinkWallet, // por si quieres usarlo fuera
  };
}
