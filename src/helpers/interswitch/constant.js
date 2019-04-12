const Interswitch = require("interswitch");
let interswitch = new Interswitch(
    process.env.clientIdPay,
    process.env.secretPay,
    process.env.TestENV
);
module.exports = {
    interswitch
}