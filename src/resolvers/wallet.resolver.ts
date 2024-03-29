import {
  fundWallet,
  getTransactionDetails,
  initateTransaction,
  transactionHistory,
  walletToBankTransfer,
  walletToWalletTransfer
} from "../helpers/wallet.helper";
import { getToken } from "../middleware/utils";

export default {
  Query: {
    getTransactionDetails: async (parent, args, ctx, info) => {
      const token = getToken(ctx);
      if (!token) {
        throw new Error("Not Authenticated");
      }

      return await getTransactionDetails(token, args.transactionReference);
    },
    walletTransactionHistory: async (parent, args, ctx, info) => {
      const token = getToken(ctx);
      if (!token) {
        throw new Error("Not Authenticated");
      }

      return await transactionHistory(token);
    }
  },
  Mutation: {
    walletToWalletTransfer: async (parent, args, ctx, info) => {
      const token = getToken(ctx);
      if (!token) {
        throw new Error("Not Authenticated");
      }
      const { receiverPhone, amount } = args.data;
      return await walletToWalletTransfer(token, receiverPhone, amount);
    },
    walletToBankTransfer: async (parent, args, ctx, info) => {
      const token = getToken(ctx);
      if (!token) {
        throw new Error("Not Authenticated");
      }
      const { accountNumber, bankCode, amount } = args.data;
      return await walletToBankTransfer(token, amount, accountNumber, bankCode);
    },
    initiateTransaction: async (parent, args, ctx, info) => {
      const token = getToken(ctx);
      if (!token) {
        throw new Error("Not Authenticated");
      }
      const { amount } = args.data;
      return await initateTransaction(token, amount);
    },
    fundWallet: async (parent, args, ctx, info) => {
      const token = getToken(ctx);
      if (!token) {
        throw new Error("Not Authenticated");
      }
      const { transactionReference } = args.data;
      return await fundWallet(token, transactionReference);
    }
  }
};
