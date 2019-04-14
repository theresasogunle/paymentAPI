const Interswitch = require("interswitch");
const jsSHA = require("jssha");
require("dotenv").config();
let interswitch = new Interswitch(
    "IKIA9614B82064D632E9B6418DF358A6A4AEA84D7218",
    "XCTiBtLy1G9chAnyg0z3BcaFK4cVpwDg/GTw2EmjTZ8=",
    "SANDBOX"
);

function generateMAC(request) {
    let initiation = request.initiation;
    let termination = request.termination;
    let init =
        initiation.amount +
        initiation.currencyCode +
        initiation.paymentMethodCode +
        termination.amount +
        termination.currencyCode +
        termination.paymentMethodCode +
        termination.countryCode;
    let shaObj = new jsSHA("SHA-512", "TEXT");
    shaObj.update(init);
    let hash = shaObj.getHash("HEX");
    return hash;
}
module.exports = {
    interswitch,
    generateMAC
}