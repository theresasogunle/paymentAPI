import {
  authenticateUser,
  createUser,
  login,
  resetPassword,
  sendPasswordResetCode,
  sendVerificationCode,
  updatePassword,
  updateProfile,
  verifyUser,
  user
} from "../helpers/user.helpers";
import { getToken } from "../middleware/utils";
import { prisma } from "../schema/generated/prisma-client";

export default {
  Query: {
    authenticateUser: async (parent, args, ctx, info) => {
      return await authenticateUser(args.phonenumber);
    },
    user: async(parent, args, ctx, info) => {
      const token = getToken(ctx);
      if (!token) {
        throw new Error("Not Authenticated");
      }
      return await user(token);
    },
    getEasPayUserDetails: async(parent, args, ctx, info) => {
      return await user(null, args.phonenumber);
    },
  },
  Mutation: {
    signUp: async (parent, args, ctx, info) => {
      return await createUser(args.data);
    },
    verifyUser: async (parent, args, ctx, info) => {
      const { phonenumber, code } = args.data;
      return await verifyUser(phonenumber, code);
    },
    resendVerificationCode: async (parent, args, ctx, info) => {
      const { phonenumber } = args.data;
      return await sendVerificationCode(phonenumber);
    },
    loginUser: async (parent, args, ctx, info) => {
      return await login(args.data);
    },
    forgotPassword: async (parent, args, ctx, info) => {
      const { phonenumber } = args.data;
      return await sendPasswordResetCode(phonenumber);
    },
    resetPassword: async (parent, args, ctx, info) => {
      const { phonenumber, code, password } = args.data;
      return await resetPassword(phonenumber, code, password);
    },
    updatePassword: async (parent, args, ctx, info) => {
      const { oldPassword, newPassword } = args.data;
      const token = getToken(ctx);
      if (!token) {
        throw new Error("Not Authenticated");
      }
      return await updatePassword(token, oldPassword, newPassword);
    },
    updateProfile: async (parent, args, ctx, info) => {
      const { fullname, gender } = args.data;
      const token = getToken(ctx);
      if (!token) {
        throw new Error("Not Authenticated");
      }
      return await updateProfile(token, fullname, gender);
    }
  },
  User: {
    wallet: async (parent, args, ctx, info) => {
      const wallets = await prisma.wallets({
        where: {
          user: {
            id: parent.id
          }
        }
      })
      return wallets[0]
    }
  }
};
