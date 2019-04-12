import { User } from "../../schema/generated/prisma-client";
import { interswitch } from "../interswitch/constant";
require("dotenv").config();

function getUniqueId() {
  let id = new Date().getTime();

  id += (id + Math.random() * 16) % 16 | 0;

  return id;
}

export async function interswitchPay(
  pan: string,
  expDate: string,
  cvv: string,
  pin: string,
  amount: number,
  user: User
) {
  // card details
  let authData = await interswitch.getAuthData({
    pan: pan,
    expDate: expDate,
    cvv: cvv,
    pin: pin
  });

  let req = {
    customerId: user.phonenumber, // Email, mobile number, BVN etc to uniquely identify the customer.
    amount: amount, // Amount in Naira.
    transactionRef: "ISW-SDK-PAYMENT-" + getUniqueId(), // Unique transaction reference number.
    currency: "NGN", // ISO Currency code.
    authData: authData // representative authData
  };

  await interswitch.send(
    {
      url: "api/v3/purchases",
      method: "POST",
      requestData: req,
      httpHeaders: {
        "Content-Type": "application/json"
      }
    },

    (err, response, body) => {
      if (err) {
        console.log("err in consumer");
        console.log(JSON.stringify(err));
        return err;
      } else {
        console.log("response was successful");
        console.log(JSON.stringify(response.body));
        return response;
      }
    }
  );
}
