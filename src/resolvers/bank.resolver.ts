import { banks, verifyBank } from "../helpers/bank.helper";

export default {
  Query: {
    banks: async (parent, args, ctx, info) => {
      return await banks();
    },
    getBankDetails: async (parent, args, ctx, info) => {
      const { accountNumber, bankCode } = args.data;
      return await verifyBank(accountNumber, bankCode);
    }
  }
};
