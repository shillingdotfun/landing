import api from "./api";

export interface PaymentConfirmationRequestInterface {
  reference: string,
  signature: string,
}

export interface PaymentConfirmationResponseInterface {
  success: boolean,
  message: string,
  data: {
    payment_id: string,
    credits_granted: number,
    amount_paid: number,
    currency: string,
    new_credit_balance: number,
    sender_wallet: string,
    is_token_payment: boolean,
  },
  errors?: string[],
}

export const confirmSolanaPayment = async (payload: PaymentConfirmationRequestInterface): Promise<PaymentConfirmationResponseInterface> => {
  return await api.post('/solana-payment/confirm', payload);
}
