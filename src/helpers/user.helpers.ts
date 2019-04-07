import { prisma, User, Gender } from "../schema/generated/prisma-client";
var dateFormat = require("dateformat");
var bcrypt = require("bcryptjs");
import { salt } from "../const";
import { sign } from "jsonwebtoken";
import mail from "../functions/mail";
import { verifyToken } from "../middleware/utils";
require("dotenv").config();

export async function createUser(data: User) {
  // extract the date of birth and password for modifications
  let { DOB, password, email } = data;

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
  data.DOB = formatDate;
  data.password = password;
  const user = await prisma.createUser(data);
  return sendVerificationCode(user.email);
}

export async function sendVerificationCode(email: string, code?: number) {
  const user = await prisma.user({
    email
  });
  // check if it has been verified
  if (user.verified) {
    throw new Error("User has been verified");
  }
  return new Promise(async (resolve, reject) => {
    // generate a 6 digit number for verification if code is not present
    if (!code) {
      code = Math.floor(Math.random() * 900000) + 100000;
    }

    if (String(code).length !== 6) {
      throw new Error("Code must be 6 digits");
    }

    //check if an activation Code exists before for the user
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
      message: `Hello ${
        user.firstname
      }. Welcome to the future of Insurance. Enter this ${
        newVerificationCode.code
      }, to verify your account`,
      subject: `Welcome to KarigoInsur`
    });
    resolve({
      user,
      status: "successful",
      message: "Please verify with the code sent to you"
    });
  });
}

export async function verifyUser(email: string, code?: number) {
  //check if an activation Code exists before for the user
  const verificationCodes = await prisma.verificationCodes({
    where: {
      user: {
        email: email
      }
    }
  });

  if (verificationCodes.length < 1) {
    throw new Error("Error occured while trying to verify");
  }

  const verificationCode = verificationCodes[0];

  if (verificationCode.code === code) {
    const expTime = new Date(verificationCode.updatedAt);
    var now = new Date();
    // subtract date
    var diffMs = now.getTime() - expTime.getTime();
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if (diffMins <= 60) {
      // update the user verified status to true
      await prisma.updateUser({
        where: {
          email: email
        },
        data: {
          verified: true
        }
      });

      // delete verification code
      await prisma.deleteVerificationCode({
        id: verificationCode.id
      });

      const user = await prisma.user({
        email
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
  email: string;
  password: string;
}

export async function login(loginData: LoginData) {
  const { email, password } = loginData;
  const user = await prisma.user({
    email
  });
  // if no user
  if (!user) {
    throw new Error("Invalid Details");
  }

  //If not verified
  if (user.verified == false) {
    throw new Error("not_verified");
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
        user.firstname
      }. Use this code: ${code} to reset your password`,
      subject: "KarigoInsur Password Reset"
    });

    return {
      user,
      status: "successful",
      message: "Please reset your password with the code sent to you"
    };
  } catch (error) {}
}

export async function resetPassword(
  email: string,
  code: number,
  password: string
) {
  const passwordResetCodes = await prisma.passwordResetCodes({
    where: {
      user: {
        email
      }
    }
  });

  if (passwordResetCodes.length == 0) {
    throw new Error("Request for a password reset");
  }

  const passwordResetCode = passwordResetCodes[0];

  // if code align change the password
  if (passwordResetCode.code === code) {
    const expTime = new Date(passwordResetCode.updatedAt);
    var now = new Date();
    // subtract date
    var diffMs = now.getTime() - expTime.getTime();
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    if (diffMins <= 60) {
      const user = await prisma.updateUser({
        where: {
          email
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
  const { id, email, user } = <any>verifyToken(token);

  // checks if the type of user is a user
  if (user == "user") {
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
  firstname: string,
  lastname: string,
  gender: Gender
) {
  const { id, email, user } = <any>verifyToken(token);

  // checks if the type of user is a user
  if (user == "user") {
    const person = await prisma.user({
      email
    });

    await prisma.updateUser({
      where: {
        email
      },
      data: {
       firstname,
       lastname,
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