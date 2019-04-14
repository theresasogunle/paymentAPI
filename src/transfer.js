var jwt = require('jsonwebtoken');
var jsSHA = require('jssha');
var Interswitch = require('interswitch');
var Axios = require('axios');

var secret = "XCTiBtLy1G9chAnyg0z3BcaFK4cVpwDg/GTw2EmjTZ8=";
var clientId = "IKIA9614B82064D632E9B6418DF358A6A4AEA84D7218";
var access_token = "eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOlsicXVpY2t0ZWxsZXIiLCJxdWlja3RlbGxlci13YWxsZXQiXSwic2NvcGUiOlsicHJvZmlsZSJdLCJleHAiOjE1NTQ4MTM5NDIsImNsaWVudF9sb2dvIjpudWxsLCJqdGkiOiI0YjA5NDVkMy0xN2U3LTRiN2UtYjBiMS0zMTVhNWMxMGMyYTMiLCJjbGllbnRfZGVzY3JpcHRpb24iOm51bGwsImNsaWVudF9pZCI6IklLSUEzMUVDMjUxN0QyMEY5RDlCMUE2RTM2Q0MxQ0IxMThCNTYzNEFDMzFGIn0.avhSj_mRQUocJhJ8kMs7ykvJuppZPCw1JFpkcDnkgdRh_7smnr4cjnOD-wrvceNWeHTtEeTEHSfknkAiehGRO1sBMvG1gkHSeB2b28aX2fpFiQqkPDSozjOkGQBKZ061OgLoAEvMzmZAhLeST2a4Q1ZZ_cSqmDPff9UwKA-i1XMJqPTgxfHVi8nA_MVRnCLWrqsXEmqPAh2ZCrNJoikrXHyK2sVJ_F6jRH8rVZbtVCGnWKDA5hQ2wzZsup5C1eSVdWpNbJm0O4-aKQdtReb8WQYjAWZdEMr1g-aAkHMU4IcIGAHyeWmyUuc9uncQi1t0GKeOXyDmJGag1fd2bUOI4A"


var ENV = "SANDBOX"; // or PRODUCTION
//get banks

Axios({
        url: `https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/resolve_account`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            recipientaccount: "0690000031",
            destbankcode: "044",
            PBFPubKey: "FLWPUBK-f9224b2a0d6d958f24eeb42ad6585f3d-X"
        }
    })
    .then((response) => {


        if ((response.data.data.data.responsecode === "NR0")) {
            console.log("error, can't resolve account");

        } else {
            let name = response.data.data.data.accountname;
            let splitName = name.split(' ')[0];
            console.log(splitName);

            var interswitch = new Interswitch(clientId, secret, ENV);
            var req1 = {
                "mac	": "",
                "beneficiary": {
                    "lastname": response.data.data.data.accountname,
                    "othernames": response.data.data.data.accountname
                },
                "initiation": {
                    "amount": 100000,
                    "channel": 7,
                    "currencyCode": "566",
                    "paymentMethodCode": "CA"
                },
                "sender": {
                    "email": "isw@interswitch.com",
                    "lastname": "Phil colins",
                    "othernames": "Phil colins",
                    "phone": "08124888436"
                },
                "termination": {
                    "accountReceivable": {
                        "accountNumber": "0012000887",
                        "accountType": 10
                    },
                    "amount": 100000,
                    "countryCode": "NG",
                    "currencyCode": 566,
                    "entityCode": "058",
                    "paymentMethodCode": "AC"
                },
                "transferCode": `${1413}${getUniqueId()}`
            };

            console.log(generateMAC(req1));

            req1.mac = generateMAC(req1);


            var obj1 = {
                url: "api/v2/quickteller/payments/transfers",
                method: "POST",
                requestData: req1,
                httpHeaders: {
                    "Content-Type": "application/json",
                }
            };
            // send the actual request
            interswitch.send(obj1, function (err, response, res2) {
                if (err) {
                    console.log("err in consumer");
                    console.log(JSON.stringify(err));
                } else {
                    console.log("response was successful");
                    console.log("bank response " + JSON.stringify(response.body));


                }
            });

        }
    })
    .catch(function (error) {

        console.log(error);

    });


var getUniqueId = function () {
    var id = new Date().getTime();

    id += (id + Math.random() * 16) % 16 | 0;

    return id;
};



function generateMAC(request) {

    var initiation = request.initiation;
    var termination = request.termination;
    var init = initiation.amount + initiation.currencyCode + initiation.paymentMethodCode +
        termination.amount + termination.currencyCode + termination.paymentMethodCode + termination.countryCode;
    var shaObj = new jsSHA("SHA-512", "TEXT");
    shaObj.update(init);
    var hash = shaObj.getHash("HEX");
    return hash;
}