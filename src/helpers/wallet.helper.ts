import BaseURL from "../functions/rave";
import { verifyToken } from "../middleware/utils";
import { prisma, TransactionType } from "../schema/generated/prisma-client";
import { verifyBank } from "./bank.helper";
import { interswitchTransfer } from "./interswitch/transfer";
require("dotenv").config();
// create wallet transaction
export async function createWalletTransaction(
  walletId: string,
  amount: number,
  description: string,
  transactionType: TransactionType
) {
  // create wallet transaction
  return await prisma.createWalletTransaction({
    amount: amount,
    type: transactionType,
    description: description,
    wallet: {
      connect: {
        id: walletId
      }
    }
  });
}
// initiate transaction
export async function initateTransaction(token: string, amount: number) {
  // create wallet transaction
  const { user } = verifyToken(token) as any;
  if (user === "user") {
    // get the sender's wallet
    const wallet = await prisma.wallets({
      where: {
        user: {
          phonenumber: user.phonenumber
        }
      }
    });
    const transaction = (await prisma.createWalletTransaction({
      amount: amount,
      type: "Pending",
      description: "Transaction initiated",
      wallet: {
        connect: {
          id: wallet[0].id
        }
      }
    })) as any;

    return {
      transactionReference: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description
    };
  }
}
// wallet to wallet transaction
export async function walletToWalletTransfer(
  token: string,
  receiverPhone: string,
  amount: number
) {
  const { user, email } = verifyToken(token) as any;

  // if authenticated as user
  if (user === "user") {
    // ensures the receiver's phone number starts from +234
    if (receiverPhone.startsWith("0")) {
      let tel = receiverPhone;
      receiverPhone = "+234" + tel.substr(1);
    }
    // get user
    const userSender = await prisma.user({
      email
    });

    // get sender wallet
    const walletSender = await prisma.wallets({
      where: {
        user: {
          phonenumber: user.phonenumber
        }
      }
    });
    // get the wallet of the receiver using the phonenumber
    const walletReceiver = await prisma.wallets({
      where: {
        user: {
          phonenumber: receiverPhone
        }
      }
    });

    // get receiver's details
    const userReceiver = await prisma.user({
      phonenumber: receiverPhone
    });

    if (walletReceiver === null) {
      return {
        status: `error`,
        message: `please check the phone number`
      };
    }

    // if the amount to be transferred is less than the current amount in the wallet
    // throw insufficient funds error, else continue with the transfer process
    if (walletSender[0].amount >= amount) {
      // create a debit wallet transaction
      createWalletTransaction(
        walletSender[0].id,
        amount,
        `Transfer ${amount} to ${userReceiver.fullname} `,
        "Debit"
      );

      // update sender wallet with the remaining amount left after the transfer
      await prisma.updateWallet({
        data: {
          amount: walletSender[0].amount - amount
        },
        where: {
          id: walletSender[0].id
        }
      });

      // create a wallet transaction for crediting the receiver's wallet
      createWalletTransaction(
        walletReceiver[0].id,
        amount,
        `${amount} transfered from ${userSender.fullname} `,
        "Credit"
      );
      // update the receiver's wallet with the new amount
      await prisma.updateWallet({
        data: {
          amount: walletReceiver[0].amount + amount
        },
        where: {
          id: walletReceiver[0].id
        }
      });
    } else {
      return {
        status: `error`,
        message: `insufficient funds`,
        data: "no data available"
      };
    }
  }
  return {
    status: `success`,
    message: `wallet transfer successful`,
    data: "no data available"
  };
}

// wallet to bank transaction
export async function walletToBankTransfer(
  token: string,
  amount: number,
  accountNumber: string,
  bankCode: string
) {
  // get user from token
  const { user, email } = verifyToken(token) as any;
  if (user === "user") {
    const person = await prisma.user({
      email
    });
    // get the sender's wallet
    const wallet = await prisma.wallets({
      where: {
        user: {
          email
        }
      }
    });

    if (wallet[0].amount >= amount) {
      const bank = (await verifyBank(accountNumber, bankCode)) as any;
      let accountName = bank.data.data.accountname;
      let transferPrefix = "1413";
      let transferCode = `${transferPrefix}${getUniqueId()}`;
      console.log(accountNumber,
        accountName.split(" ")[0],
        accountName.split(" ")[1],
        amount,
        bankCode,
        transferCode,
        person);
      
      const transferResponse = (await interswitchTransfer(
        accountNumber,
        accountName.split(" ")[0],
        accountName.split(" ")[1],
        amount,
        bankCode,
        transferCode,
        person
      )) as any;
      if (
        transferResponse.responseCode === "90000" &&
        transferResponse.transferCode === transferCode
      ) {
        await createWalletTransaction(
          wallet[0].id,
          amount,
          `${amount} transferred to bank account: ${accountName} `,
          "Debit"
        );
        await prisma.updateWallet({
          data: {
            amount: wallet[0].amount - amount
          },
          where: {
            id: wallet[0].id
          }
        });
        return {
          status: "success",
          message: "transfer done",
          data: transferResponse
        };
      } else {
        return {
          status: "error",
          message: "error while trying to make this transfer",
          data: transferResponse
        };
      }
    }
  }
}

// initiate wallet transaction
export async function fundWallet(token: string, transactionReference: string) {
  // get user from token
  const { user, email } = verifyToken(token) as any;
  if (user === "user") {
    // fetch transaction details with wallet_transaction_id
    const walletTransaction = await prisma.walletTransaction({
      id: transactionReference
    });

    // check if transaction exists
    if (walletTransaction == null) {
      throw new Error("Transaction does not exist");
    }

    // verify from Rave
    const response = (await verify(transactionReference)) as any;

    // if successful update wallet accordingly
    if (
      response.body.data.status === "successful" &&
      response.body.data.chargecode === "00"
    ) {
      // query user wallet
      const wallet = await prisma.wallets({
        where: {
          user: {
            email
          }
        }
      });

      // update wallet transaction
      await prisma.updateWalletTransaction({
        data: {
          amount: response.body.data.amount,
          type: "Credit",
          wallet: {
            connect: {
              id: wallet[0].id
            }
          }
        },
        where: {
          id: transactionReference
        }
      });

      // update wallet
      await prisma.updateWallet({
        data: {
          amount: response.body.data.amount + wallet[0].amount
        },
        where: {
          id: wallet[0].id
        }
      });

      return {
        status: "success",
        message: "successfully funded wallet",
        data: response.body.data
      };
    } else {
      await prisma.deleteWalletTransaction({
        id: transactionReference
      });
      return {
        status: "error",
        message: "error occured while funding wallet",
        data: response.body.data
      };
    }
  }
}

const getUniqueId = () => {
  let id = new Date().getTime();

  id += (id + Math.random() * 16) % 16 | 0;

  return id;
};
const verify = async (transactionReference: any) => {
  const unirest = require("unirest");
  const payload = {
    SECKEY: process.env.RAVE_SK,
    txref: transactionReference
  };
  const serverUrl = BaseURL() + "/flwv3-pug/getpaidx/api/v2/verify";
  return new Promise((resolve, reject) => {
    unirest
      .post(serverUrl)
      .headers({
        "Content-Type": "application/json"
      })
      .send(payload)
      .end(response => {
        resolve(response);
      });
  });
};
