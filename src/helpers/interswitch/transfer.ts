import { User } from "../../schema/generated/prisma-client";
import { generateMAC, interswitch } from "../interswitch/constant";

export const interswitchTransfer = async (
  accountNumber: string,
  lastname: string,
  othername: string,
  amount: number,
  bankCode: string,
  transferCode: string,
  senderUser: User
) => {
  let req = {
    mac: "",
    beneficiary: {
      lastname: lastname,
      othernames: othername
    },
    initiation: {
      amount: amount,
      channel: 7,
      currencyCode: "566",
      paymentMethodCode: "CA"
    },
    sender: {
      email: senderUser.email,
      lastname: senderUser.fullname.split(" ")[1],
      othernames: senderUser.fullname.split(" ")[0],
      phone: senderUser.phonenumber
    },
    termination: {
      accountReceivable: {
        accountNumber: accountNumber,
        accountType: 10
      },
      amount: amount,
      countryCode: "NG",
      currencyCode: 566,
      entityCode: bankCode,
      paymentMethodCode: "AC"
    },
    transferCode: transferCode
  };
  req.mac = await generateMAC(req);

  const obj = {
    url: "api/v2/quickteller/payments/transfers",
    method: "POST",
    requestData: await req,
    httpHeaders: {
      "Content-Type": "application/json"
    }
  };

  // send the actual request
  return new Promise((resolve, reject) => {
    interswitch.send(obj, (err, response, body) => {
      if (err) {
        // tslint:disable-next-line: no-console
        console.log("err in consumer");
        // tslint:disable-next-line: no-console
        console.log(JSON.stringify(err));
        console.log("Response : " + response);

        reject(err);
      } else {
        // tslint:disable-next-line: no-console
        console.log("response was successful");
        resolve(JSON.parse(body));
      }
    });
  });
};
