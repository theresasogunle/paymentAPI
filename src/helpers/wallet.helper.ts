import Axios from "axios";
import mail from "../functions/mail";
import BaseURL from "../functions/rave";
import { verifyToken } from "../middleware/utils";
import {
  PaymentMedium,
  prisma,
  TransactionType
} from "../schema/generated/prisma-client";
import { banks, verifyBank } from "./bank.helper";
import { interswitchTransfer } from "./interswitch/transfer";
import { raveTransfer } from "./rave/transfer";

require("dotenv").config();

let fee = 0;
// create wallet transaction
export async function createWalletTransaction(
  walletId: string,
  amount: number,
  description: string,
  transactionType: TransactionType,
  medium: PaymentMedium,
  mediumName: string,
  mediumNumber: string,
  total: number,
  fee: number
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
    },
    medium: medium,
    mediumName: mediumName,
    mediumNumber: mediumNumber,
    total: total,
    fee: fee
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
      description: transaction.description,
      status: "success"
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
        "Debit",
        `Easpay`,
        `Easpay Wallet`,
        userSender.phonenumber,
        amount + fee,
        fee
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
      await createWalletTransaction(
        walletReceiver[0].id,
        amount,
        `${amount} transfered from ${userSender.fullname} `,
        "Credit",
        `Easpay`,
        `Easpay Wallet`,
        userSender.phonenumber,
        amount + fee,
        fee
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

      await mail({
        user: userSender,
        message: `Hi! ${
          userSender.fullname
        }.You have just made a transfer of ${amount}NGN  to ${
          userReceiver.fullname
        }'s Easpay wallet`,
        subject: `New Wallet Transaction`
      });
      await mail({
        user: userReceiver,
        message: `Hi! ${userReceiver.fullname},${
          userSender.fullname
        } just sent  ${amount}NGN  to your Easpay wallet!`,
        subject: `New Wallet Transaction`
      });
      return {
        amount: amount,
        total: amount + fee,
        fee: fee,
        medium: `Easpay`,
        mediumNumber: userSender.phonenumber,
        mediumName: `Easpay Wallet`,
        status: `success`,
        data: `No data available`,
        message: `wallet transfer successful`
      };
    } else {
      return {
        amount: amount,
        total: amount + fee,
        fee: fee,
        mediumName: `Easpay Wallet`,
        medium: `Easpay`,
        status: `error`,
        data: `No data available`,
        message: `wallet transfer failed`
      };
    }
  }
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
      let transferCodeRave = `${getUniqueId()}`;
      const bank = (await verifyBank(accountNumber, bankCode)) as any;
      let accountName = bank.data.data.accountname;
      return new Promise((resolve, reject) => {
        Axios({
          url: BaseURL() + "/v2/gpx/transfers/create",
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          data: {
            account_bank: bankCode,
            account_number: accountNumber,
            narration: `Transfer to to ${accountName} .`,
            currency: "NGN",
            seckey: process.env.RAVE_SK,
            reference: "TXR_deatt_" + transferCodeRave + "-Y",
            amount: amount,
            beneficiary_name: accountName
          }
        })
          .then(async response => {
            if (response.data.status === "success") {
              await createWalletTransaction(
                wallet[0].id,
                amount,
                `${amount} transferred to bank account: ${accountName} `,
                "Debit",
                `Easpay`,
                `Easpay Wallet`,
                person.phonenumber,
                amount + fee,
                fee
              );
              await prisma.updateWallet({
                data: {
                  amount: wallet[0].amount - amount
                },
                where: {
                  id: wallet[0].id
                }
              });
              await mail({
                user: person,
                message: `Hi! ${
                  person.fullname
                },you have just made a transfer of ${amount}NGN out of your Easpay wallet!`,
                subject: `New Wallet Transaction`
              });

              resolve({
                amount: response.data.data.amount,
                transactionReference: transferCodeRave,
                total: response.data.data.amount + fee,
                fee: fee,
                medium: "Easpay",
                mediumName: `Easpay Wallet`,
                mediumNumber: person.phonenumber,
                status: `success`,
                message: `wallet transfer successful`,
                data: response.data.data
              });
            } else {
              resolve({
                amount: amount,
                total: amount + fee,
                fee: fee,
                medium: `Easpay`,
                mediumName: `Easpay Wallet`,
                mediumNumber: person.phonenumber,
                status: `error`,
                message: `error while trying to make this transfer`,
                data: response.data.data
              });
            }
          })
          .catch(function(err) {
            reject(err);
          });
      });

      // let transferPrefix = "1413";
      // let transferCode = `${transferPrefix}${getUniqueId()}`;
      // const transferResponse = (await interswitchTransfer(
      //   accountNumber,
      //   accountName.split(" ")[0],
      //   accountName.split(" ")[1],
      //   amount,
      //   bankCode,
      //   transferCode,
      //   person
      // )) as any;
      // if (
      //   transferResponse.responseCode === "90000" &&
      //   transferResponse.transferCode === transferCode
      // ) {
      //   await createWalletTransaction(
      //     wallet[0].id,
      //     amount,
      //     `${amount} transferred to bank account: ${accountName} `,
      //     "Debit",
      //     `Easpay`,
      //     `Easpay Wallet`,
      //     person.phonenumber,
      //     amount + fee,
      //     fee
      //   );
      //   await prisma.updateWallet({
      //     data: {
      //       amount: wallet[0].amount - amount
      //     },
      //     where: {
      //       id: wallet[0].id
      //     }
      //   });
      //   return {
      //     amount: amount,
      //     transactionReference: null,
      //     total: amount + fee,
      //     fee: fee,
      //     medium: `Easpay`,
      //     mediumName: `Easpay Wallet`,
      //     mediumNumber: person.phonenumber,
      //     status: `success`,
      //     message: `wallet transfer successful`,
      //     data: transferResponse
      //   };
      // } else {
      //   return {
      //     amount: amount,
      //     total: amount + fee,
      //     fee: fee,
      //     medium: `Easpay`,
      //     mediumName: `Easpay Wallet`,
      //     mediumNumber: person.phonenumber,
      //     status: `error`,
      //     message: `error while trying to make this transfer`,
      //     data: transferResponse
      //   };
      // }
    } else {
      throw new Error("insufficient balance");
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
    const person = await prisma.user({
      email
    });

    // check if transaction exists
    if (walletTransaction == null) {
      throw new Error("Transaction does not exist");
    }
    // query user wallet
    const wallet = await prisma.wallets({
      where: {
        user: {
          email
        }
      }
    });
    // verify from Rave
    const response = (await verify(transactionReference)) as any;
    if (
      response.body.data.status === "successful" &&
      response.body.data.chargecode === "00"
    ) {
      if (response.body.data.paymenttype === "account") {
        const bankData = (await banks()) as any;

        let bank_code = response.body.data.account.account_bank;

        let _banks = [];

        bankData.data.map(bank => {
          _banks.push({
            code: bank.Code,
            name: bank.Name
          });
        });

        const bankName = await search(bank_code, _banks);
        // if successful update wallet accordingly

        // update wallet transaction
        await prisma.updateWalletTransaction({
          data: {
            amount: response.body.data.amount,
            type: "Credit",
            wallet: {
              connect: {
                id: wallet[0].id
              }
            },
            medium: "Bank",
            mediumNumber: response.body.data.account.account_number,
            mediumName: bankName.name,
            fee: fee,
            total: response.body.data.amount + fee
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
        await mail({
          user: person,
          message: `Hi! ${
            person.fullname
          },you have just funded your Easpay wallet with ${
            response.body.data.amount
          } NGN`,
          subject: `New Wallet Transaction`
        });

        return {
          amount: response.body.data.amount,
          transactionReference: transactionReference,
          total: response.body.data.amount + fee,
          fee: fee,
          medium: "Bank",
          mediumNumber: response.body.data.account.account_number,
          mediumName: bankName.name,
          status: "success",
          message: "successfully funded wallet",
          data: response.body.data
        };
      } else if (response.body.data.paymenttype === "card") {
        // update wallet transaction
        await prisma.updateWalletTransaction({
          data: {
            amount: response.body.data.amount,
            type: "Credit",
            wallet: {
              connect: {
                id: wallet[0].id
              }
            },
            medium: "Bank",
            mediumNumber: response.body.data.card.last4digits,
            mediumName: response.body.data.type,
            fee: fee,
            total: response.body.data.amount + fee
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
        await mail({
          user: person,
          message: `Hi! ${
            person.fullname
          },you have just funded your Easpay wallet with ${
            response.body.data.amount
          } NGN`,
          subject: `New Wallet Transaction`
        });
        return {
          amount: response.body.data.amount,
          transactionReference: transactionReference,
          total: response.body.data.amount + fee,
          fee: fee,
          medium: "Card",
          mediumNumber: response.body.data.card.last4digits,
          mediumName: response.body.data.card.type,
          status: "success",
          message: "successfully funded wallet",
          data: response.body.data
        };
      }
    } else {
      await prisma.deleteWalletTransaction({
        id: transactionReference
      });
      return {
        amount: response.body.data.amount,
        transactionReference: transactionReference,
        total: response.body.data.amount + fee,
        fee: fee,
        medium: null,
        mediumName: null,
        mediumNumber: null,
        status: "error",
        message: "error occured while funding wallet",
        data: response.body.data
      };
    }
  }
}

export async function getTransactionDetails(
  token: string,
  transactionReference: string
) {
  // get user from token
  const { user, email } = verifyToken(token) as any;
  if (user === "user") {
    // fetch transaction details with wallet_transaction_id
    const walletTransaction = await prisma.walletTransaction({
      id: transactionReference
    });

    return {
      amount: walletTransaction.amount,
      transactionReference: walletTransaction.id,
      total: walletTransaction.total,
      fee: walletTransaction.fee,
      medium: walletTransaction.medium,
      mediumName: walletTransaction.mediumName,
      mediumNumber: walletTransaction.mediumNumber,
      status: "success",
      message: "transaction fetched"
    };
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
function search(nameKey, myArray) {
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].code === nameKey) {
      return myArray[i];
    }
  }
}
