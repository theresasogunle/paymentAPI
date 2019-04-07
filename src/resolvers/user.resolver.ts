import {createUser, verifyUser, login, sendVerificationCode, sendPasswordResetCode, resetPassword, updatePassword, updateProfile} from '../helpers/user.helpers';
import { getToken } from "../middleware/utils";

export default {
  Mutation: {
    signUp: async(parent, args, ctx, info) => {
      return await createUser(args.data);
    },
    verifyUser: async(parent, args, ctx, info) => {
      const {email, code} = args.data
      return await verifyUser(email, code);
    },
    resendVerificationCode: async(parent, args, ctx, info) => {
      const {email} = args.data
      return await sendVerificationCode(email);
    },
    loginUser: async(parent, args, ctx, info) => {
      return await login(args.data)
    },
    forgotPassword: async(parent, args, ctx, info) => {
      const {email} = args.data
      return await sendPasswordResetCode(email);
    },
    resetPassword: async(parent, args, ctx, info) => {
      const {email, code, password} = args.data
      return await resetPassword(email, code, password);
    },
    updatePassword: async(parent, args, ctx, info) => {
      const {oldPassword, newPassword} = args.data
      const token = getToken(ctx);
      if (!token) {
        throw new Error('Not Authenticated');
      }
      return await updatePassword(token, oldPassword, newPassword);
    },
    updateProfile: async(parent, args, ctx, info) => {
      const {firstname, lastname, gender} = args.data
      const token = getToken(ctx);
      if (!token) {
        throw new Error('Not Authenticated');
      }
      return await updateProfile(token, firstname, lastname, gender);
    }
  }
}