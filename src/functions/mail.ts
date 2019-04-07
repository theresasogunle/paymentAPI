require("dotenv").config();
import { User } from "../schema/generated/prisma-client";

const mailgun = require("mailgun-js")({
  apiKey: process.env.MG_API_KEY,
  domain: process.env.MG_DOMAIN
});

interface Message {
  user: User;
  message: string;
  subject: string;
}

export default function mail(input: Message) {
  const { user, message, subject } = input;
  var data = {
    from: "KarigoInsur <noreply@deatt.com>",
    to: user.email,
    subject: subject,
    text: message
  };
  if (process.env.ENV.toLowerCase() === "test") {
    return;
  }
  mailgun.messages().send(data, function(error, body) {
    if (error) {
      console.log(error);
    }
  });
}
