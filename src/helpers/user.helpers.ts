import { Gender, prisma, User } from "../schema/generated/prisma-client";
const dateFormat = require("dateformat");
const bcrypt = require("bcryptjs");
import { sign } from "jsonwebtoken";
import { salt } from "../const";
import mail from "../functions/mail";
import { verifyToken } from "../middleware/utils";
require("dotenv").config();

/**
 * Function to validate email address
 * @param {String} email {Required} The email to be validated
 * @return {Boolean} A Boolean value indicating if the email is valid
 * N/B
 * This isn't fool proof and there is no fool proof way of
 * validating an email address.
 */
const validateEmail = (email: string) => {
  const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  if (!email.match(pattern)) {
    throw new Error("Email address not supported");
  }
};

const validateTransactionPin = (pin: string, repeatPin: string) => {
  const pattern = /^[0-9]*$/gm;
  if (pin.length !== 4) {
    throw new Error("Invalid transaction pin");
  }
  if (pin !== repeatPin) {
    throw new Error("Your pin is not the same");
  }
  if (!pin.match(pattern)) {
    throw new Error("Invalid transaction pin");
  }
};

const validateFullName = (fullname: string) => {
  const pattern1 = /^[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+$/;
  const pattern2 = /^[a-zA-Z]+ [a-zA-Z]+$/;
  if (fullname.match(pattern1) || fullname.match(pattern2)) {
    return true;
  } else {
    throw new Error("Invalid name");
  }
};

export async function authenticateUser(phonenumber: string) {
  // check if phone number is an actual phone number
  if (phonenumber.length < 11) {
    throw new Error("Your phone number is incomplete");
  }
  // convert phone number to +234 format
  if (phonenumber.startsWith("0")) {
    let tel = phonenumber;
    phonenumber = "+234" + tel.substr(1);
  }
  const user = await prisma.user({
    phonenumber
  });
  if (user == null) {
    return {
      phonenumber,
      status: "register"
    };
  }
  if (!user.verified) {
    return {
      phonenumber,
      status: "verify"
    };
  }
  return {
    phonenumber,
    status: "login"
  };
}

export async function createUser(data: User) {
  // extract the date of birth and password for modifications
  let { DOB, password, email, phonenumber, fullname, profile_picture } = data;

  // check if phone number is an actual phone number
  if (phonenumber.length < 11) {
    throw new Error("Your phone number is incomplete");
  }

  // validate the geniunity of email address
  await validateEmail(email);

  // validate users name
  await validateFullName(fullname);

  // convert phone number to +234 format
  if (phonenumber.startsWith("0")) {
    let tel = phonenumber;
    phonenumber = "+234" + tel.substr(1);
  }

  // check if password is greater than 7 characters
  if (password.length < 8) {
    throw new Error("Your password should be greater than 7 characters");
  }

  let formatDate;
  // format the date
  formatDate = dateFormat(DOB, "yyyy-mm-dd HH:MM:ss");
  // put in a format the database understands
  formatDate = new Date(formatDate);
  // hash password
  password = bcrypt.hashSync(password, salt);

  // add it back to the data object
  data.DOB = formatDate;
  data.password = password;
  data.phonenumber = phonenumber;
  const user = await prisma.createUser(data);

  return sendVerificationCode(user.email);
}

export async function setTransactionPin(
  token: string,
  transaction_pin: string,
  repeat_transaction_pin: string
) {
  // validate the transaction pin
  await validateTransactionPin(transaction_pin, repeat_transaction_pin);
  // hash transaction pin
  transaction_pin = bcrypt.hashSync(transaction_pin, salt);
}

export async function sendVerificationCode(email: string, code?: number) {
  const user = await prisma.user({
    email
  });
  // check if it has been verified
  if (user.verified) {
    throw new Error("User has been verified");
  }
  // generate a 6 digit number for verification if code is not present
  if (!code) {
    code = Math.floor(Math.random() * 900000) + 100000;
  }
  if (String(code).length !== 6) {
    throw new Error("Code must be 6 digits");
  }

  // check if an activation Code exists before for the user
  const verificationCodes = await prisma.verificationCodes({
    where: {
      user: {
        email
      }
    }
  });

  let verificationCode;
  // if it exists delete the verification code
  if (verificationCodes.length > 0) {
    verificationCode = verificationCodes[0];
    await prisma.deleteVerificationCode({
      id: verificationCode.id
    });
  }

  // create the verification
  const newVerificationCode = await prisma.createVerificationCode({
    code,
    user: {
      connect: {
        email
      }
    }
  });

  await mail({
    user,
    message: `Hello ${user.fullname}. Welcome to Payment App. Enter this ${
      newVerificationCode.code
    }, to verify your account`,
    subject: `Welcome to Payment App`
  });
  return {
    user,
    status: "successful",
    message: "Please verify with the code sent to you"
  };
}

export async function verifyUser(phonenumber: string, code?: number) {
  // convert phone number to +234 format
  if (phonenumber.startsWith("0")) {
    let tel = phonenumber;
    phonenumber = "+234" + tel.substr(1);
  }

  // check if an activation Code exists before for the user
  const verificationCodes = await prisma.verificationCodes({
    where: {
      user: {
        phonenumber
      }
    }
  });

  if (verificationCodes.length < 1) {
    throw new Error("Error occured while trying to verify");
  }

  const verificationCode = verificationCodes[0];

  if (verificationCode.code === code) {
    const expTime = new Date(verificationCode.updatedAt);
    let now = new Date();
    // subtract date
    let diffMs = now.getTime() - expTime.getTime();
    let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if (diffMins <= 60) {
      // update the user verified status to true
      await prisma.updateUser({
        where: {
          phonenumber
        },
        data: {
          verified: true
        }
      });
      // create Wallet
      await prisma.createWallet({
        amount: 0,
        user: {
          connect: {
            phonenumber
          }
        }
      });

      // delete verification code
      await prisma.deleteVerificationCode({
        id: verificationCode.id
      });

      const user = await prisma.user({
        phonenumber
      });

      return {
        user,
        token: sign(
          {
            id: user.id,
            email: user.email,
            user: "user"
          },
          process.env.JWT_SECRET
        )
      };
    }
    throw new Error("Verification code expired");
  }
  throw new Error("Incorrect verification code");
}

interface LoginData {
  phonenumber: string;
  password: string;
}

export async function login(loginData: LoginData) {
  let { phonenumber, password } = loginData;
  // convert phone number to +234 format
  if (phonenumber.startsWith("0")) {
    let tel = phonenumber;
    phonenumber = "+234" + tel.substr(1);
  }
  const user = await prisma.user({
    phonenumber
  });
  // if no user
  if (!user) {
    throw new Error("Invalid Details");
  }
  // Confirm Password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Invalid Details");
  }

  // return json web token
  return {
    user,
    token: sign(
      {
        id: user.id,
        email: user.email,
        phonenumber: user.phonenumber,
        user: "user"
      },
      process.env.JWT_SECRET
    )
  };
}

export async function sendPasswordResetCode(email: string, code?: number) {
  if (!code) {
    code = Math.floor(Math.random() * 900000) + 100000;
  }

  if (String(code).length !== 6) {
    throw new Error("Code must be 6 digits");
  }

  // fetch user
  const user = await prisma.user({
    email
  });

  // password reset codes
  const passwordResetCodes = await prisma.passwordResetCodes({
    where: {
      user: {
        email
      }
    }
  });

  // check if reset code exist before
  if (passwordResetCodes.length > 0) {
    // password reset code
    const passwordResetCode = passwordResetCodes[0];

    await prisma.deletePasswordResetCode({
      id: passwordResetCode.id
    });
  }

  await prisma.createPasswordResetCode({
    code,
    user: {
      connect: {
        email
      }
    }
  });

  try {
    await mail({
      user,
      message: `Hi ${
        user.fullname
      }. Use this code: ${code} to reset your password`,
      subject: "Payment App Password Reset"
    });

    return {
      user,
      status: "successful",
      message: "Please reset your password with the code sent to you"
    };
  } catch (error) {}
}

export async function resetPassword(
  phonenumber: string,
  code: number,
  password: string
) {
  // convert phone number to +234 format
  if (phonenumber.startsWith("0")) {
    let tel = phonenumber;
    phonenumber = "+234" + tel.substr(1);
  }

  const passwordResetCodes = await prisma.passwordResetCodes({
    where: {
      user: {
        phonenumber
      }
    }
  });

  if (passwordResetCodes.length === 0) {
    throw new Error("Request for a password reset");
  }

  const passwordResetCode = passwordResetCodes[0];

  // if code align change the password
  if (passwordResetCode.code === code) {
    const expTime = new Date(passwordResetCode.updatedAt);
    let now = new Date();
    // subtract date
    let diffMs = now.getTime() - expTime.getTime();
    let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    if (diffMins <= 60) {
      const user = await prisma.updateUser({
        where: {
          phonenumber
        },
        data: {
          password: await bcrypt.hashSync(password, salt)
        }
      });

      return {
        user,
        token: sign(
          {
            id: user.id,
            email: user.email,
            user: "user"
          },
          process.env.JWT_SECRET
        )
      };
    }
    throw new Error("Password reset code expired");
  }
  throw new Error("Wrong password reset code");
}

export async function updatePassword(
  token: string,
  oldPassword: string,
  newPassword: string
) {
  const { id, email, user } = verifyToken(token) as any;

  // checks if the type of user is a user
  if (user === "user") {
    const person = await prisma.user({
      email
    });
    // Confirm Old Password
    const valid = await bcrypt.compare(oldPassword, person.password);
    if (!valid) {
      throw new Error("Old Password Incorrect");
    }

    // confirm user is not using the same password
    const newValid = await bcrypt.compare(newPassword, person.password);
    if (newValid) {
      throw new Error("Choose a new password");
    }

    await prisma.updateUser({
      where: {
        email
      },
      data: {
        password: await bcrypt.hashSync(newPassword, salt)
      }
    });

    return {
      user: person,
      token: sign(
        {
          id: user.id,
          email: user.email,
          user: "user"
        },
        process.env.JWT_SECRET
      )
    };
  }
  throw new Error("Not Authorized");
}

export async function updateProfile(
  token: string,
  fullname: string,
  gender: Gender
) {
  const { id, email, user } = verifyToken(token) as any;

  // checks if the type of user is a user
  if (user === "user") {
    const person = await prisma.user({
      email
    });

    await prisma.updateUser({
      where: {
        email
      },
      data: {
        fullname,
        gender
      }
    });

    return {
      user: person,
      status: "successful",
      message: "Your profile has been updated"
    };
  }
  throw new Error("Not Authorized");
}
