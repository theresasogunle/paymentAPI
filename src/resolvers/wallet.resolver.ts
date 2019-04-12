import {
  initiateWalletTransaction,
  walletTransfer
} from "../helpers/wallet.helper";
import { getToken } from "../middleware/utils";

export default {
  Mutation: {
    initiateWalletTransaction: async (parent, args, ctx, info) => {
      const token = getToken(ctx);
      const { amount } = args.data;
      if (!token) {
        throw new Error("Not Authenticated");
      }
      return await initiateWalletTransaction(token, amount);
    },
    walletTransfer: async (parent, args, ctx, info) => {
      const token = getToken(ctx);
      if (!token) {
        throw new Error("Not Authenticated");
      }
      const { receiverPhone, amount } = args.data;
      return await walletTransfer(token, receiverPhone, amount);
    }
  }
};
