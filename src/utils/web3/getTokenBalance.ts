// src/utils/web3/getTokenBalance.ts
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  TOKEN_PROGRAM_ID, 
  TOKEN_2022_PROGRAM_ID 
} from '@solana/spl-token';
import { getRpcEndpoint } from './rpcProviders';


interface TokenBalanceResult {
  balance: number;
  decimals: number;
  uiBalance: number;
  tokenProgram?: 'spl-token' | 'spl-token-2022';
}

/** Native SOL if no mint or "native" */
export const isNativeSOL = (maybeMint?: string) => !maybeMint || maybeMint === 'native';

/**
 * Detect which token program (Token v3 or Token-2022) a mint uses
 * @param connection Solana connection
 * @param mintAddress The mint address to check
 * @returns The program ID that owns this mint
 */
export const detectTokenProgram = async (
  connection: Connection,
  mintAddress: PublicKey
): Promise<PublicKey> => {
  try {
    const mintInfo = await connection.getAccountInfo(mintAddress);
    
    if (!mintInfo) {
      throw new Error('Mint account not found');
    }

    // Check if the mint is owned by TOKEN_2022_PROGRAM_ID
    if (mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
      return TOKEN_2022_PROGRAM_ID;
    }
    
    // Default to standard TOKEN_PROGRAM_ID
    return TOKEN_PROGRAM_ID;
  } catch (error) {
    console.warn('Could not detect token program, defaulting to TOKEN_PROGRAM_ID:', error);
    return TOKEN_PROGRAM_ID;
  }
};

/**
 * Gets the token balance for a specific token in the given wallet
 * Supports both SPL Token and SPL Token-2022 (Token Extensions)
 * @param walletAddress The wallet address to check
 * @param tokenMintAddress The mint address of the token or 'native' for SOL
 * @param rpcUrl Optional custom RPC URL
 * @returns Object containing token balance information
 */
export const getTokenBalance = async (
  walletAddress: string, 
  tokenMintAddress: string,
  rpcUrl?: string
): Promise<TokenBalanceResult> => {
  // Use the provided RPC or get it from the rpcProviders utility
  const endpoint = rpcUrl || getRpcEndpoint();
  const connection = new Connection(endpoint, 'confirmed');

  try {
    const walletPublicKey = new PublicKey(walletAddress);

    // Handle native SOL
    if (isNativeSOL(tokenMintAddress)) {
      const balanceInLamports = await connection.getBalance(walletPublicKey);
      const uiBalance = balanceInLamports / LAMPORTS_PER_SOL;
      
      return {
        balance: balanceInLamports,
        decimals: 9, // SOL has 9 decimals
        uiBalance,
        tokenProgram: 'spl-token' // SOL uses the standard token program
      };
    }

    // Handle SPL tokens and SPL Token-2022
    const tokenMintPublicKey = new PublicKey(tokenMintAddress);

    // Detect which token program this mint uses
    const tokenProgramId = await detectTokenProgram(connection, tokenMintPublicKey);
    const isToken2022 = tokenProgramId.equals(TOKEN_2022_PROGRAM_ID);

    // Get the associated token address for this wallet and token with the correct program
    const tokenAccount = await getAssociatedTokenAddress(
      tokenMintPublicKey,
      walletPublicKey,
      false, // allowOwnerOffCurve
      tokenProgramId // Specify the correct token program
    );

    // Get token mint information to determine decimals
    const tokenMintInfo = await connection.getParsedAccountInfo(
      tokenMintPublicKey,
      'confirmed'
    );
    
    let decimals = 0;
    
    // Extract decimals information if available
    if (
      tokenMintInfo.value && 
      'parsed' in tokenMintInfo.value.data && 
      tokenMintInfo.value.data.parsed.info.decimals !== undefined
    ) {
      decimals = tokenMintInfo.value.data.parsed.info.decimals;
    }

    try {
      // Try to get the token account information
      const tokenAccountInfo = await connection.getParsedAccountInfo(
        tokenAccount,
        'confirmed'
      );
      
      // If token account exists and has balance information
      if (
        tokenAccountInfo.value && 
        'parsed' in tokenAccountInfo.value.data && 
        tokenAccountInfo.value.data.parsed.info.tokenAmount
      ) {
        const rawBalance = tokenAccountInfo.value.data.parsed.info.tokenAmount.amount;
        const uiBalance = tokenAccountInfo.value.data.parsed.info.tokenAmount.uiAmount || 0;
        
        return {
          balance: Number(rawBalance),
          decimals,
          uiBalance,
          tokenProgram: isToken2022 ? 'spl-token-2022' : 'spl-token'
        };
      }
    } catch (err) {
      console.log(`Token account likely does not exist for ${isToken2022 ? 'Token-2022' : 'SPL Token'}:`, err);
      // If there's an error finding the token account, it probably doesn't exist (zero balance)
    }
    
    // If account not found or error occurs, return zero balance
    return {
      balance: 0,
      decimals,
      uiBalance: 0,
      tokenProgram: isToken2022 ? 'spl-token-2022' : 'spl-token'
    };
  } catch (error) {
    console.error('Error getting token balance:', error);
    return {
      balance: 0,
      decimals: 0,
      uiBalance: 0
    };
  }
};
