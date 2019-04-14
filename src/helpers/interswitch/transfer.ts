import { User } from "../../schema/generated/prisma-client";
import { generateMAC, interswitch } from "../interswitch/constant";

const getUniqueId = () => {
  let id = new Date().getTime();

  id += (id + Math.random() * 16) % 16 | 0;

  return id;
};
console.log(interswitch);

export async function interswitchTransfer(
  accountNumber: string,
  lastname: string,
  othername: string,
  amount: number,
  bankCode: string,
  senderUser: User
) {
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
      lastname: senderUser.fullname.split(" ")[0],
      othernames: senderUser.fullname.split(" ")[1],
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
    transferCode: `${1413}${getUniqueId()}`
  };
  req.mac = await generateMAC(req);

  const obj = {
    url: "api/v2/quickteller/payments/transfers",
    method: "POST",
    requestData: req,
    httpHeaders: {
      "Content-Type": "application/json"
    }
  };
  // send the actual request
  await interswitch.send(obj, async (err, response, res2) => {
    if (err) {
      console.log("err in consumer");
      console.log(JSON.stringify(err));
    } else {
      console.log("response was successful");
      console.log("bank response " + (await JSON.stringify(response.body)));
      return await response.body;
    }
  });
}
