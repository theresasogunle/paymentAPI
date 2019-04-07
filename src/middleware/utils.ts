import { verify } from "jsonwebtoken";
require("dotenv").config();

export function getToken(context) {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    return token;
  }
  return false;
}

export function verifyToken(token) {
  return verify(token, process.env.JWT_SECRET);
}
