import Axios from "axios";
import BaseURL from "../functions/rave";

// get all banks function to get the CBN code
export async function banks() {
  return new Promise((resolve, reject) => {
    // rave url
    Axios.get(`${BaseURL()}/v2/banks/NG?public_key=FLWPUBK-9b658dd72a5dfeec4d9db80b46e214e4-X`)
      .then(response => {
        // handle success
        resolve({
          status: response.data.status,
          message: response.data.message,
          data: response.data.data.Banks
        });
      })
      .catch(error => {
        // handle error
        reject(error);
      });
  });
}

// resolve account function to get account name
export const verifyBank = async (accountNumber: string, bankCode: string) => {
  return new Promise((resolve, reject) => {
    Axios({
      url: `${BaseURL()}/flwv3-pug/getpaidx/api/resolve_account`,
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        recipientaccount: accountNumber,
        destbankcode: bankCode,
        PBFPubKey: process.env.RAVE_PK
      }
    })
      .then(response => {
        try {
          resolve({
            status: response.data.status,
            message: response.data.message,

            data: response.data.data
          });
        } catch (error) {
          console.log(error);
        }
      })
      .catch(error => {
        reject(
          "Status: " +
            error.response.status +
            ". Message: " +
            error.response.statusText
        );
      });
  });
};
