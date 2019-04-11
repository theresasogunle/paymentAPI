const {
  createUser,
  sendVerificationCode
} = require("../src/helpers/user.helpers");
import {
  login,
  resetPassword,
  sendPasswordResetCode,
  updatePassword,
  verifyUser
} from "../src/helpers/user.helpers";
import { prisma } from "../src/schema/generated/prisma-client";
import { destroyUsersTable, destroyWalletTable } from "./functions/users";
const dateFormat = require("dateformat");
const bcrypt = require("bcryptjs");

let data;
const verificationCode = 234567;
const password1 = "password1";
const password2 = "password2";

describe("test all users functions", () => {
  // clear the database after all test runs
  beforeAll(() => {
    destroyWalletTable();
    return destroyUsersTable();
  });
  afterAll(() => {
    return destroyUsersTable();
  });

  // set the data before each tests
  beforeEach(() => {
    data = {
      fullname: "Oluwole Ibrahim",
      DOB: "Jun 9 1992",
      email: "flamekeed@gmail.com",
      phonenumber: "+2347032190293",
      password: "password",
      gender: "Male",
      profile_picture: "image",
      transaction_pin: "1234"
    };
  }, 30000);

  test("should throw error if password is less than 8 characters", async () => {
    try {
      data.password = "pass";
    } catch (error) {
      expect(error.message).toBe(
        "Your password should be greater than 7 characters"
      );
    }
  }, 10000);

  test("signup a user", async () => {
    const user = await createUser(data);
    delete data.DOB;
    delete data.password;
    expect(user.user).toMatchObject(data);
  });

  test("ensures password is hashed", async () => {
    const user = await prisma.user({ email: data.email });
    const check = await bcrypt.compareSync(data.password, user.password);
    expect(check).toBeTruthy();
  }, 10000);

  test("ensures date of birth is the same as the one in the DB", async () => {
    // extract the date of birth and password for modifications
    let { DOB } = data;

    // format the date
    DOB = dateFormat(DOB, "yyyy-mm-dd");

    const user = await prisma.user({ email: data.email });
    const dbDOB = dateFormat(user.DOB, "yyyy-mm-dd");
    expect(dbDOB).toBe(DOB);
  });

  test("should set verified to false when a user signups", async () => {
    const user = await prisma.user({ email: data.email });
    expect(user.verified).toBeFalsy();
  });

  test("should not verify user with incorrect code", async () => {
    try {
      let user = await prisma.user({ email: data.email });
      await sendVerificationCode(user.email, verificationCode);
      const verifyUserData = await verifyUser(user.email, 999999);
      user = await prisma.user({ email: data.email });
      expect(verifyUserData).toBeNull();
    } catch (error) {
      expect(error.message).toBe("Incorrect verification code");
    }
  }, 30000);

  test("should verify user with correct code", async () => {
    let user = await prisma.user({ email: data.email });
    await sendVerificationCode(user.email, verificationCode);
    await verifyUser(user.email, verificationCode);
    user = await prisma.user({ email: data.email });

    expect(user.verified).toBeTruthy();
  }, 30000);
  test("should check is wallet is present", async () => {
    let wallet = await prisma.wallets({
      where: {
        user: {
          email: data.email
        }
      }
    });
    expect(wallet[0]).toBeDefined();
  });

  test("should login a user", async () => {
    const user = await login({ email: data.email, password: data.password });
    expect(Object.keys(user).sort()).toEqual(["token", "user"].sort());
  });

  test("should not resend verification code if verified", async () => {
    try {
      let user = await prisma.user({ email: data.email });
    } catch (error) {
      expect(error.message).toBe("User has been verified");
    }
  }, 10000);

  test("should send reset password code", async () => {
    // tslint:disable-next-line: no-shadowed-variable
    const resetPassword = await sendPasswordResetCode(data.email, 456789);
    expect(resetPassword.status).toBe("successful");
  });

  test("should change password on forgot password", async () => {
    await resetPassword(data.email, 456789, password1);
    const user = await login({ email: data.email, password: password1 });
    expect(Object.keys(user).sort()).toEqual(["token", "user"].sort());
  });

  test("should change password on update password", async () => {
    const user = await login({ email: data.email, password: password1 });
    await updatePassword(user.token, password1, password2);
    const userNewPass = await login({ email: data.email, password: password2 });
    expect(Object.keys(userNewPass).sort()).toEqual(["token", "user"].sort());
  });
});
