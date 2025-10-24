// src/hooks/solana/useSolanaPayment.ts
import { useCallback, useMemo, useState } from 'react';
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import {
getMint,
createTransferCheckedInstruction,
getAssociatedTokenAddress,
ASSOCIATED_TOKEN_PROGRAM_ID,
createAssociatedTokenAccountIdempotentInstruction,
} from '@solana/spl-token';
import {
  address,
  appendTransactionMessageInstructions,
  compileTransaction,
  createNoopSigner,
  createSolanaRpc,
  createTransactionMessage,
  getTransactionEncoder,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/kit';
import { getTransferSolInstruction } from '@solana-program/system';
import { createQR, encodeURL, findReference, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';
import bs58 from 'bs58';
import { ConnectedStandardSolanaWallet, useSignAndSendTransaction, useWallets } from '@privy-io/react-auth/solana';

import solanaLogoBlack from '../../assets/images/solana-logo.svg';
import { confirmSolanaPayment, PaymentConfirmationRequestInterface } from '../../services/credits.service';
import { getRpcEndpoint } from '../../utils/web3/rpcProviders';
import useIsMobile from '../useIsMobile';
import { detectTokenProgram, isNativeSOL } from '../../utils/web3/getTokenBalance';

interface PaymentRequest {
  amount: string; // decimal string (e.g. "1.5")
  description: string;
  orderId: string;
  onSuccess?: (signature: string) => void;
  onError?: (error: string) => void;
}

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  paymentUrl: string | null;
  reference: PublicKey | null;
  qrCode: string | null; // data URL (desktop only)
}

/* ------------ Hook ------------ */

export const useSolanaPayment = () => {
  const isMobile = useIsMobile()
  // Privy: connected wallets and sign+send helper
  const { wallets, ready: walletsReady } = useWallets();
  const { signAndSendTransaction } = useSignAndSendTransaction();

  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    paymentUrl: null,
    reference: null,
    qrCode: null,
  });

  // Your read-only connection (safe to keep using)
  const connection = useMemo(() => {
    const endpoint =
      import.meta.env.VITE_SOLANA_RPC_ENDPOINT ||
      'https://api.mainnet-beta.solana.com';
    return new Connection(endpoint, { commitment: 'confirmed' });
  }, []);

  const getSenderWallet = (): ConnectedStandardSolanaWallet | undefined =>
    wallets?.[0];
  const getSenderAddress = () => getSenderWallet()?.address;

  /* ---------- Public method: createPaymentRequest (Solana Pay URL/QR) ---------- */
  const createPaymentRequest = useCallback(
    async (request: PaymentRequest) => {
      const sender = getSenderAddress();
      if (!walletsReady || !sender) {
        setPaymentState((prev) => ({ ...prev, error: 'No wallet connected' }));
        return;
      }

      setPaymentState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Unique reference for this payment
        const reference = Keypair.generate().publicKey;

        // Merchant (recipient) wallet and mint
        const recipient = new PublicKey(import.meta.env.VITE_MERCHANT_WALLET);
        const mintEnv = import.meta.env.VITE_TOKEN_MINT;
        const payingSol = isNativeSOL(mintEnv);

        const label = 'WuAI AI credits purchase';
        const message = `Payment for ${request.description}`;
        const amount = new BigNumber(request.amount);

        // Build the Solana Pay URL
        const url = payingSol
          ? encodeURL({
              recipient,
              amount,
              reference,
              label,
              message,
              memo: `Order: ${request.orderId}`,
            })
          : encodeURL({
              recipient,
              amount,
              reference,
              label,
              message,
              memo: `Order: ${request.orderId}`,
              splToken: new PublicKey(mintEnv),
            });

        // Generate QR only on desktop
        let dataUrl: string | null = null;
        if (!isMobile) {
          try {
            const qr = createQR(url, 256);
            qr.update({
              dotsOptions: { color: '#000000', type: 'rounded' },
              cornersSquareOptions: { color: '#000000', type: 'extra-rounded' },
              image: solanaLogoBlack,
              backgroundOptions: { color: '#fff' },
            });
            const raw = await qr.getRawData('png');
            if (raw) {
              const blob = new Blob([raw], { type: 'image/png' });
              dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });
            }
          } catch (e) {
            console.warn('QR generation failed', e);
          }
        }

        setPaymentState({
          isLoading: false,
          error: null,
          paymentUrl: url.toString(),
          reference,
          qrCode: dataUrl,
        });

        // Start monitoring until we find a matching transfer to the reference
        await monitorPayment(
          reference,
          amount,
          recipient,
          request.onSuccess,
          (err) => {
            setPaymentState((prev) => ({ ...prev, error: err }));
            request.onError?.(err);
          },
        );
      } catch (e: any) {
        console.error(e);
        setPaymentState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            'Error creating payment request: ' + (e?.message || 'Unknown error'),
        }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletsReady, wallets, connection],
  );

  /* ---------- Internal builders for direct payments ---------- */

  // Build a SOL native transfer with @solana/kit and return serialized bytes
  const buildNativeSolTransaction = useCallback(
    async (payer: ConnectedStandardSolanaWallet, recipient: PublicKey, amountSol: string) => {
      // Convert SOL decimal to lamports (BigInt)
      const lamports = BigInt(
        new BigNumber(amountSol)
          .multipliedBy(LAMPORTS_PER_SOL)
          .integerValue(BigNumber.ROUND_FLOOR)
          .toString(),
      );

      const ix = getTransferSolInstruction({
        amount: lamports,
        destination: address(recipient.toBase58()),
        source: createNoopSigner(address(payer.address)),
      });

      const { getLatestBlockhash } = createSolanaRpc(getRpcEndpoint());
      const { value: latestBlockhash } = await getLatestBlockhash().send();

      const txBytes = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(address(payer.address), tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions([ix], tx),
        (tx) => compileTransaction(tx),
        (tx) => new Uint8Array(getTransactionEncoder().encode(tx)),
      );

      return { txBytes };
    },
    [],
  );

  // Build an SPL token transfer (Token v3 or Token-2022) with web3.js/spl-token and return serialized bytes
  const buildSplTokenTransaction = useCallback(
    async (
      payer: ConnectedStandardSolanaWallet,
      recipient: PublicKey,
      mint: PublicKey,
      amountUi: string,
    ) => {
      const senderPk = new PublicKey(payer.address);

      // Detect correct program and fetch mint info (decimals)
      const programId = await detectTokenProgram(connection, mint);
      const mintInfo = await getMint(connection, mint, 'confirmed', programId);

      // Associated Token Accounts
      const sourceATA = await getAssociatedTokenAddress(
        mint,
        senderPk,
        false,
        programId,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      const destATA = await getAssociatedTokenAddress(
        mint,
        recipient,
        false,
        programId,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      const tx = new Transaction();

      // Ensure merchant's ATA exists (idempotent)
      const destInfo = await connection.getAccountInfo(destATA);
      if (!destInfo) {
        tx.add(
          createAssociatedTokenAccountIdempotentInstruction(
            senderPk, // payer
            destATA, // ATA to create
            recipient, // owner of ATA (merchant)
            mint,
            programId,
            ASSOCIATED_TOKEN_PROGRAM_ID,
          ),
        );
      }

      // Convert UI amount to raw units
      const rawAmount = BigInt(
        new BigNumber(amountUi)
          .multipliedBy(new BigNumber(10).pow(mintInfo.decimals))
          .integerValue(BigNumber.ROUND_FLOOR)
          .toString(),
      );

      // Checked transfer
      tx.add(
        createTransferCheckedInstruction(
          sourceATA,
          mint,
          destATA,
          senderPk,
          rawAmount,
          mintInfo.decimals,
          [],
          programId,
        ),
      );

      // Set fee payer and recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('finalized');
      tx.feePayer = senderPk;
      tx.recentBlockhash = blockhash;

      // Serialize without signatures (Privy will handle signing)
      const txBytes = tx.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      return { txBytes };
    },
    [connection],
  );

  /* ---------- Public method: directPayment (mobile/desktop) ---------- */
  const directPayment = useCallback(
    async (request: PaymentRequest) => {
      const senderWallet = getSenderWallet();
      if (!walletsReady || !senderWallet) {
        setPaymentState((p) => ({ ...p, error: 'No wallet connected' }));
        return;
      }

      setPaymentState((p) => ({ ...p, isLoading: true, error: null }));

      try {
        const recipient = new PublicKey(import.meta.env.VITE_MERCHANT_WALLET);
        const mintEnv = import.meta.env.VITE_TOKEN_MINT;
        const payingSol = isNativeSOL(mintEnv);

        // Build the transaction bytes depending on currency
        let txBytes: Uint8Array;

        if (payingSol) {
          // SOL native via @solana/kit
          const { txBytes: bytes } = await buildNativeSolTransaction(
            senderWallet,
            recipient,
            request.amount,
          );
          txBytes = bytes;
        } else {
          // SPL token via web3.js/spl-token (serialize before sending)
          const mint = new PublicKey(mintEnv);
          const { txBytes: bytes } = await buildSplTokenTransaction(
            senderWallet,
            recipient,
            mint,
            request.amount,
          );
          txBytes = bytes;
        }

        // Sign + send with Privy 3 (opens the selected wallet if needed)
        const { signature } = await signAndSendTransaction({
          transaction: txBytes,
          wallet: senderWallet,
        });

        // Convert returned bytes -> base58 (what web3.js expects)
        const sigBase58 = bs58.encode(signature);

        // Confirm on-chain by signature only (simplest and type-safe)
        await connection.confirmTransaction(sigBase58, 'confirmed');

        setPaymentState((p) => ({ ...p, isLoading: false }));
        request.onSuccess?.(sigBase58);

        // Notify backend for traceability
        await notifyBackend({
          signature: sigBase58,
          reference: request.orderId, // keep current semantics
        });
      } catch (e: any) {
        console.error('Direct payment error', e);
        setPaymentState((p) => ({
          ...p,
          isLoading: false,
          error:
            'Error processing direct payment: ' + (e?.message || 'Unknown error'),
        }));
        request.onError?.('Error processing payment');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletsReady, wallets, connection, signAndSendTransaction, buildNativeSolTransaction, buildSplTokenTransaction],
  );

  /* ---------- Public method: createMobilePayment (kept as alias) ---------- */
  const createMobilePayment = useCallback(
    async (req: PaymentRequest) => {
      // Same route as directPayment under Privy 3.x
      await directPayment(req);
    },
    [directPayment],
  );

  /* ---------- Internal helper: monitor Solana Pay reference ---------- */
  const monitorPayment = useCallback(
    async (
      reference: PublicKey,
      amount: BigNumber,
      recipient: PublicKey,
      onSuccess?: (signature: string) => void,
      onError?: (error: string) => void,
    ) => {
      try {
        let attempts = 0;
        const maxAttempts = 24; // ~2 minutes (24 * 5s)
        const mintEnv = import.meta.env.VITE_TOKEN_MINT;
        const payingSol = isNativeSOL(mintEnv);
        const maybeSplMint = payingSol ? undefined : new PublicKey(mintEnv);

        const interval = setInterval(async () => {
          attempts++;
          if (attempts > maxAttempts) {
            clearInterval(interval);
            onError?.('Payment timeout - please try again');
            return;
          }

          try {
            const sigInfo = await findReference(connection, reference);

            // Validate transfer (include splToken when relevant)
            await validateTransfer(connection, sigInfo.signature, {
              recipient,
              amount,
              reference,
              splToken: maybeSplMint,
            });

            // Success
            clearInterval(interval);
            const sigStr =
              typeof sigInfo.signature === 'string'
                ? sigInfo.signature
                : bs58.encode(sigInfo.signature as Uint8Array);

            onSuccess?.(sigStr);

            await notifyBackend({
              signature: sigStr,
              reference: reference.toString(),
            });
          } catch (err: any) {
            // Keep polling if not found yet
            const msg = err?.message?.toLowerCase?.() ?? '';
            if (msg.includes('not found')) return;
            clearInterval(interval);
            console.error('validateTransfer error', err);
            onError?.('Payment validation failed - please try again');
          }
        }, 5000);
      } catch (err) {
        console.error('monitorPayment error', err);
        onError?.('Payment monitoring failed - please try again');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connection],
  );

  /* ---------- Internal helper: notify backend ---------- */
  const notifyBackend = useCallback(
    async (payload: PaymentConfirmationRequestInterface) => {
      try {
        setPaymentState((prev) => ({ ...prev, isLoading: true }));
        const resp = await confirmSolanaPayment(payload);
        if (!resp.success) {
          setPaymentState((prev) => ({
            ...prev,
            isLoading: false,
            error: resp.message,
          }));
          return;
        }
      } catch (e) {
        console.error('notifyBackend error', e);
      }
      setPaymentState((prev) => ({ ...prev, isLoading: false }));
    },
    [],
  );

  return {
    ...paymentState,
    createPaymentRequest,
    createMobilePayment, // alias to directPayment under Privy 3.x
    directPayment,
  };
};
