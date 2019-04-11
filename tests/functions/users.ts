import { prisma } from "../../src/schema/generated/prisma-client";
const { createUser } = require("../../src/helpers/user.helpers");

export async function destroyWalletTable() {
  await prisma.deleteManyWallets();
}
export async function destroyUsersTable() {
  await prisma.deleteManyVerificationCodes();
  await prisma.deleteManyPasswordResetCodes();
  return prisma.deleteManyUsers();
}

const userOne = {
  input: {
    fullname: "Oluwole Ibrahim",
    lastname: "Adebiyi",
    DOB: "Jun 9 1992",
    email: "test@mail.com",
    phonenumber: "+2347032190293",
    password: "password",
    gender: "Male",
    profile_picture: "image",
    transaction_pin: "1234"
  }
  // user: undefined,
  // jwt: undefined
};

export async function seedUsersTable() {
  const user = await createUser(userOne.input);
}
