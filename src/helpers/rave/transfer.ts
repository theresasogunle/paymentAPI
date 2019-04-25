import Axios from "axios";
import BaseURL from "../../functions/rave";

export const raveTransfer = async (
  bank_code: string,
  account_number: string,
  transferCode: string,
  amount: number,
  accountName: string
) => {
  return new Promise((resolve, reject) => {
    Axios({
      url: BaseURL() + "/v2/gpx/transfers/create",
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        account_bank: bank_code,
        account_number: account_number,
        narration: `Transfer to to ${accountName} .`,
        currency: "NGN",
        seckey: process.env.RAVE_SK,
        reference: "TXR_deatt_" + transferCode + "-Y",
        amount: amount,
        beneficiary_name: accountName
      }
    })
      .then(response => {
        try {
          if (response.data.status === "success") {
            resolve(response.data.status);
            console.log(response);
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch(function(err) {
        console.log("err");
        reject(err);
      });
  });
};
