var Interswitch = require('interswitch');

//uses special merchant details
var secret = "XCTiBtLy1G9chAnyg0z3BcaFK4cVpwDg/GTw2EmjTZ8=";
var clientId = "IKIA9614B82064D632E9B6418DF358A6A4AEA84D7218";


var ENV = "SANDBOX"; // or PRODUCTION
//initialize interswitch variables
var interswitch = new Interswitch(clientId, secret, ENV);

//card details
var pan = "5061030000000000084";
var expDate = "1909";
var cvv = "123";
var pin = "1234";


var authData = interswitch.getAuthData({
    pan: pan,
    expDate: expDate,
    cvv: cvv,
    pin: pin
});

//unique id
var getUniqueId = function () {
    var id = new Date().getTime();

    id += (id + Math.random() * 16) % 16 | 0;

    return id;
};

var id = getUniqueId();
var paymentReqRef = "ISW-SDK-PAYMENT-" + id;
var req = {
    "customerId": "1407002510", // Email, mobile number, BVN etc to uniquely identify the customer.
    "amount": "100", // Amount in Naira.
    "transactionRef": paymentReqRef, // Unique transaction reference number.
    "currency": "NGN", // ISO Currency code.
    "authData": authData // representative authData
};

interswitch.send({
    url: "api/v3/purchases",
    method: "POST",
    requestData: req,
    httpHeaders: {
        "Content-Type": "application/json",

    }

}, function (err, response, body) {
    if (err) {
        console.log("err in consumer");
        console.log(JSON.stringify(err));
    } else {
        console.log("response was successful");
        console.log(JSON.stringify(response.body));
    }

});