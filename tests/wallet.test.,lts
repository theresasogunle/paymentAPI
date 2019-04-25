import {
  createUser,
  login,
  sendVerificationCode,
  verifyUser
} from "../src/helpers/user.helpers";
import {
  createWalletTransaction,
  fundWallet,
  initateTransaction,
  walletToBankTransfer,
  walletToWalletTransfer
} from "../src/helpers/wallet.helper";
import { prisma } from "../src/schema/generated/prisma-client";
import { destroyUsersTable, destroyWalletTable } from "./functions/users";

const verificationCode = 234367;
let data;
let receiverData;

jest.setTimeout(30000);

describe("test all wallet functions", () => {
  beforeAll(() => {
    destroyWalletTable();
    return destroyUsersTable();
  });
  afterAll(() => {
    destroyWalletTable();
    return destroyUsersTable();
  });
  // set the data before each tests
  beforeEach(() => {
    data = {
      fullname: "Oluwole Adebiyi",
      DOB: "Jun 3 1992",
      email: "flamekeed@gmail.com",
      phonenumber: "+2347032190295",
      password: "password",
      gender: "Male",
      profile_picture: "image",
      transaction_pin: "1234"
    };
  }, 30000);
  // for wallet transfer to another user
  receiverData = {
    fullname: "Omowunmi Sogunle",
    DOB: "Aug 3 1995",
    email: "sogunledolapo@gmail.com",
    phonenumber: "+2347032190293",
    password: "password",
    gender: "Female",
    profile_picture: "image"
  };
  // create and verify user 1
  test("should create and verify user 1", async () => {
    await createUser(data);
    let user = await prisma.user({ email: data.email });
    await sendVerificationCode(user.email, verificationCode);
    await verifyUser(user.phonenumber, verificationCode);
    user = await prisma.user({ email: data.email });
    expect(user.verified).toBeTruthy();
    const wallet = await prisma.wallets({
      where: {
        user: {
          phonenumber: user.phonenumber
        }
      }
    });
    // update wallet for testing
    await prisma.updateWallet({
      data: {
        amount: 2000
      },
      where: {
        id: wallet[0].id
      }
    });
  }, 30000);
  // create and verify user 2
  test("should create and verify user 2", async () => {
    await createUser(receiverData);
    let user = await prisma.user({ phonenumber: receiverData.phonenumber });
    await sendVerificationCode(user.email, verificationCode);
    await verifyUser(user.phonenumber, verificationCode);
    user = await prisma.user({ email: receiverData.email });
    expect(user.verified).toBeTruthy();
    const wallet = await prisma.wallets({
      where: {
        user: {
          phonenumber: user.phonenumber
        }
      }
    });
    // update wallet for testing
    await prisma.updateWallet({
      data: {
        amount: 2000
      },
      where: {
        id: wallet[0].id
      }
    });
  }, 30000);

  // wallet transaction initiation testing
  test("should initiate wallet transaction", async () => {
    const wallet = await prisma.wallets({
      where: {
        user: {
          phonenumber: data.phonenumber
        }
      }
    });
    const transaction = await createWalletTransaction(
      wallet[0].id,
      500,
      "test",
      "Credit"
    );
    expect(transaction).toBeDefined();
  });

  // wallet to wallet transaction
  test("should do wallet to wallet transaction", async () => {
    const user = await login({
      phonenumber: data.phonenumber,
      password: "password"
    });
    const transfer = await walletToWalletTransfer(
      user.token,
      receiverData.phonenumber,
      1000
    );

    expect(transfer.status).toBe("success");
  }, 30000);

  // wallet to wallet transaction
  test("should do wallet to bank transaction", async () => {
    const user = await login({
      phonenumber: data.phonenumber,
      password: "password"
    });

    const transfer = await walletToBankTransfer(
      user.token,
      1000,
      "0690000031",
      "044"
    );
    expect(transfer.status).toBe("success");
  }, 30000);

  // initiate transaction
  test("should initiate wallet transaction", async () => {
    const user = await login({
      phonenumber: data.phonenumber,
      password: "password"
    });

    const transaction = await initateTransaction(user.token, 1000);
    expect(transaction.amount).toBe(1000);
  }, 30000);

  // funding wallet error
  test("should throw error while funding wallet", async () => {
    const user = await login({
      phonenumber: data.phonenumber,
      password: "password"
    });
    const trans = await initateTransaction(user.token, 1000);
    const transaction = await fundWallet(
      user.token,
      trans.transactionReference
    );
    expect(transaction.status).toBe("error");
  }, 30000);
});
