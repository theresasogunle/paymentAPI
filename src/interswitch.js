var jwt = require('jsonwebtoken');
var Interswitch = require('interswitch');
var clientId = "IKIA31EC2517D20F9D9B1A6E36CC1CB118B5634AC31F";
var secret = "jpzCe2xKvShaMm+fKTwJlQJ061YLYy+d84VVDdLPSv0=";
var access_token = "eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOlsicXVpY2t0ZWxsZXIiLCJxdWlja3RlbGxlci13YWxsZXQiXSwic2NvcGUiOlsicHJvZmlsZSJdLCJleHAiOjE1NTQ4MTM5NDIsImNsaWVudF9sb2dvIjpudWxsLCJqdGkiOiI0YjA5NDVkMy0xN2U3LTRiN2UtYjBiMS0zMTVhNWMxMGMyYTMiLCJjbGllbnRfZGVzY3JpcHRpb24iOm51bGwsImNsaWVudF9pZCI6IklLSUEzMUVDMjUxN0QyMEY5RDlCMUE2RTM2Q0MxQ0IxMThCNTYzNEFDMzFGIn0.avhSj_mRQUocJhJ8kMs7ykvJuppZPCw1JFpkcDnkgdRh_7smnr4cjnOD-wrvceNWeHTtEeTEHSfknkAiehGRO1sBMvG1gkHSeB2b28aX2fpFiQqkPDSozjOkGQBKZ061OgLoAEvMzmZAhLeST2a4Q1ZZ_cSqmDPff9UwKA-i1XMJqPTgxfHVi8nA_MVRnCLWrqsXEmqPAh2ZCrNJoikrXHyK2sVJ_F6jRH8rVZbtVCGnWKDA5hQ2wzZsup5C1eSVdWpNbJm0O4-aKQdtReb8WQYjAWZdEMr1g-aAkHMU4IcIGAHyeWmyUuc9uncQi1t0GKeOXyDmJGag1fd2bUOI4A"


var ENV = "SANDBOX"; // or PRODUCTION

var interswitch = new Interswitch(clientId, secret, ENV);

//start: sample get authData call


var pan = "6280511000000095";
var expDate = "1909";
var cvv = "123";
var pin = "1234";


var authData = interswitch.getAuthData({
    pan: pan,
    expDate: expDate,
    cvv: cvv,
    pin: pin
});

console.log("Auth data: >>> " + authData);

var getUniqueId = function () {
    var id = new Date().getTime();

    id += (id + Math.random() * 16) % 16 | 0;

    return id;
};


var sampleValidation = function () {

    var id = getUniqueId();
    var paymentReqRef = "ISW-SDK-PAYMENT-" + id;
    var req = {
        "transactionRef": paymentReqRef,
        "authData": authData
    };
    //console.log("\nValidate Req: " + req);
    var obj = {
        url: "api/v2/purchases/validations",
        method: "POST",
        requestData: req,
        httpHeaders: {
            "Content-Type": "application/json"
        }
    };

    //send the actual request
    interswitch.send(obj, function (err, res, res2) {
        if (err) {
            console.log("err in consumer");
            console.log(JSON.stringify(err));
        } else {
            console.log("response was successful");
            console.log(JSON.stringify(res));
        }
    });

};

var samplePurchase = function () {

    var id = getUniqueId();
    var paymentReqRef = "ISW-SDK-PAYMENT-" + id;
    var req = {
        "customerId": "demo@gmail.com", // Email, mobile number, BVN etc to uniquely identify the customer.
        "amount": "100", // Amount in Naira.
        "transactionRef": id, // Unique transaction reference number.
        "currency": "NGN", // ISO Currency code.
        "authData": authData // representative authData
    };

    interswitch.send({
        url: "https://sandbox.interswitchng.com/api/v2/purchases",
        method: "POST",
        requestData: req,
        httpHeaders: {
            "Content-Type": "application/json"
        }

    }, function (err, response, body) {
        if (err) {
            console.log("err in consumer");
            console.log(JSON.stringify(err));
        } else {
            console.log("response was successful");
            console.log(JSON.stringify(response));
        }

    });

};

var sampleGetEwallet = function () {

    //do EWallet call now
    interswitch.sendWithAccessToken({
        url: "api/v1/ewallet/instruments",
        method: "GET",
        accessToken: access_token
    }, function (err, response, body) {
        if (err) {
            console.log("error from paycode " + JSON.stringify(err));

        } else {
            console.log("response from paycode " + JSON.stringify(response));

        }
    });

};

var sampleGetPaycode = function () {

    //get Ewallet and get payment token from it
    interswitch.sendWithAccessToken({
        url: "api/v1/ewallet/instruments",
        method: "GET",
        accessToken: access_token
    }, function (err, response, body) {
        if (err) {
            console.log("error from paycode " + JSON.stringify(err));

        } else {

            //response = JSON.parse(response);
            //body = JSON.parse(body);

            //console.log(typeof response.body+"\n"+JSON.stringify(response.body["paymentMethods"])+"\n");
            var bodyObj = JSON.parse(response.body);
            if (response.statusCode === 200 || response.statusCode === 201) {

                var paymentToken = bodyObj.paymentMethods[1].token;
                var id = getUniqueId();
                var ttid = Math.floor(Math.random() * 900) + 100;
                var decoded = jwt.decode(access_token);
                var msisdn = decoded.mobileNo;
                var secureRequestObj = {
                    expDate: expDate,
                    cvv: cvv,
                    pin: pin,
                    mobile: msisdn,
                    ttId: ttid
                };
                var secure = interswitch.getSecureData(secureRequestObj);
                var secureData = secure.secureData;
                var pinData = secure.pinBlock;
                var macData = secure.mac;
                var httpHeader = {
                    frontendpartnerid: 'WEMA'
                };
                var req = {
                    "amount": 100000,
                    "ttid": ttid,
                    "transactionType": 'Withdrawal',
                    "paymentMethodIdentifier": paymentToken,
                    "payWithMobileChannel": 'ATM',
                    "tokenLifeTimeInMinutes": '100',
                    "oneTimePin": '1111',
                    "pinData": pinData,
                    "secure": secureData,
                    "macData": macData
                };
                interswitch.sendWithAccessToken({
                    url: "api/v1/pwm/subscribers/" + msisdn + "/tokens",
                    method: 'POST',
                    accessToken: access_token,
                    httpHeaders: httpHeader,
                    requestData: req
                }, function (err, response, body) {
                    if (err) {
                        console.log("err from paycode " + JSON.stringify(err));
                    } else {
                        var paycodeObj = JSON.parse(response.body);
                        if (response.statusCode === 200 || response.statusCode === 201) {
                            console.log("paycode is : " + paycodeObj.payWithMobileToken);
                        } else {
                            console.log("unable to generate paycode");
                        }

                    }

                });
                //make a generate paycode call

            } else {

                console.log("Unable to generate paycode \n" + JSON.stringify(response));
            }

        }
    });


};

var sampleGetAccessToken = function () {

    var id = getUniqueId();
    var paymentReqRef = "ISW-SDK-PAYMENT-" + id;
    var req = {
        "transactionRef": paymentReqRef,
        "authData": authData
    };
    //console.log("\nValidate Req: " + req);
    var obj = {
        url: "api/v2/purchases/validations",
        method: "POST",
        requestData: req,
        httpHeaders: {
            "Content-Type": "application/json"
        }
    };


    interswitch.getNewAccessToken(obj, function (err, access, res) {
        if (err) {
            console.log("\n error while generating access token " + JSON.stringify(err));
        } else {
            console.log("\n" + JSON.stringify(res) + "\n");
        }
    });
};

//start: call

//sampleValidation();
samplePurchase();
//sampleGetEwallet();
//sampleGetPaycode();
//sampleGetAccessToken();