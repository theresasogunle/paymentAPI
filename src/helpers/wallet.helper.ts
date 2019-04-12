import { verifyToken } from "../middleware/utils";
import { prisma } from "../schema/generated/prisma-client";
export async function initiateWalletTransaction(token: string, amount: number) {
  // get user from token
  const { user } = verifyToken(token) as any;
  if (user === "user") {
    // get user's wallet
    const wallet = await prisma.wallets({
      where: {
        user: {
          phonenumber: user.phonenumber
        }
      }
    });
    // create wallet transaction
    await prisma.createWalletTransaction({
      amount: amount,
      type: "Pending",
      description: `Funded wallet with ${amount}`,
      wallet: {
        connect: {
          id: wallet[0].id
        }
      }
    });
  }
  return {
    status: `success`,
    message: `wallet transaction created`
  };
}

export async function walletTransfer(
  token: string,
  receiverPhone: string,
  amount: number
) {
  const { user } = verifyToken(token) as any;

  // get the wallet of the sender using the phonenumber
  if (user === "user") {
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
    let userReceiver = await prisma.user({ phonenumber: receiverPhone });

    if (walletReceiver === null) {
      return {
        status: `error`,
        message: `please check the phone number`
      };
    }

    // if the amount to be transferred is less than the current amount in the wallet
    // throw insufficient funds error, else continue with the transfer process
    if (walletSender[0].amount > amount) {
      // create a debit wallet transaction
      await prisma.createWalletTransaction({
        amount: amount,
        type: "Debit",
        description: `Transfer ${amount} to ${userReceiver.fullname} `,
        wallet: {
          connect: {
            id: walletSender[0].id
          }
        }
      });
      let newAmount = walletSender[0].amount - amount;
      // update sender wallet with the remaining amount left after the transfer
      await prisma.updateWallet({
        data: {
          amount: newAmount
        },
        where: {
          id: walletSender[0].id
        }
      });

      // create a wallet transaction for crediting the receiver's wallet
      await prisma.createWalletTransaction({
        amount: amount,
        type: "Credit",
        description: ` ${amount} transfer from ${user.fullname} `,
        wallet: {
          connect: {
            id: walletReceiver[0].id
          }
        }
      });

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
        message: `insufficient funds`
      };
    }
  }
  return {
    status: `success`,
    message: `wallet transfer successful`
  };
}
