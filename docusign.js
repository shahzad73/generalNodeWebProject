const docusign = require('docusign-esign');
const request = require("request"),       // request module
var     async = require("async"),       // async module    


exports.test = async function(req, res){

const email = "shahzad_73@yahoo.com",              // your account email
    password = "abc@123456",         // your account password
    integratorKey = "7b1338e4-8a21-4a6a-af6c-3a1957a23971",    
    templateId = "2e744f08-9dd4-4822-81ba-c4a272bb6de7",        
    linkToDOcuSignLoginServer = 'https://demo.docusign.net/restapi/v2/login_information',

    envelopeId = "bc14310c-57c0-4168-91be-1fb71ea24c1c",            // created from step 2

    recipientName = "shahzad73@hotmail.com",          // recipient (signer) name
    templateRoleName = "Signer",        // template role that exists on template referenced above
    baseUrl = "";               // we will retrieve this


async.waterfall(
    [
        //////////////////////////////////////////////////////////////////////
        // Step 1 - Login (used to retrieve accountId and baseUrl)
        //////////////////////////////////////////////////////////////////////
        function(next) {
            var body = "";  // no request body for login api call

            // set request url, method, body, and headers
            var options = initializeRequest(linkToDOcuSignLoginServer, "GET", body, email, password);

            // send the request...
            request(options, function(err, res, body) {
                if(!parseResponseBody(err, res, body)) {
                    return;
                }
                baseUrl = JSON.parse(body).loginAccounts[0].baseUrl;
                next(null); // call next function
            });
        },

        //////////////////////////////////////////////////////////////////////
        // Step 2 - Send envelope with one Embedded recipient (using clientUserId property)
        //////////////////////////////////////////////////////////////////////
        function(next) {
            
            var jsonParameters = {
                "emailSubject": "DocuSign API call - Embedded Sending Example",
                "templateId": templateId,
                "templateRoles": [{
                    "email": email,
                    "name": recipientName,
                    "roleName": templateRoleName,
                    "clientUserId": "1001",  // user-configurable
                    "tabs": {
                          "textTabs": [
                            {
                                  "value": "Shahzad Aslam ",
                                  "width": 78,
                                  "required": "true",
                                  "locked": "true",
                                  "documentId": "1",
                                  "pageNumber": "1",
                                  "xPosition": "200",
                                  "yPosition": "50"
                            },
                            {
                                  "tabLabel": "NameOfInvesor2",
                                  "name": "NameOfInvesor",
                                  "value": "8675309",
                                  "documentId": "1",
                                  "pageNumber": "1",                             
                                  "required": "true",
                                  "locked": "true",
                            },
                          ]                    
                    },                    
                                           
                }],
                "status": "sent"
            };

            var url = baseUrl + "/envelopes";
            var body = JSON.stringify(jsonParameters);

            // set request url, method, body, and headers
            var options = initializeRequest(url, "POST", body, email, password);

            // send the request...
            request(options, function(err, res, body) {
                if(!parseResponseBody(err, res, body)) {
                    return;
                }
                // parse the envelopeId value from the response
                envelopeId = JSON.parse(body).envelopeId;
                next(null); // call next function
            });
        },

        //////////////////////////////////////////////////////////////////////
        // Step 3 - Get the Embedded Signing View (aka the recipient view)
        //////////////////////////////////////////////////////////////////////
        function(next) {
            var url = baseUrl + "/envelopes/" + envelopeId + "/views/recipient";
            var method = "POST";
            var body = JSON.stringify({
                "returnUrl": "http://localhost:3000/docusignreturn?id=122228",
                "authenticationMethod": "email",
                "email": email,
                "userName": recipientName,
                "clientUserId": "1001", // must match clientUserId in step 2!
            });

            // set request url, method, body, and headers
            var options = initializeRequest(url, "POST", body, email, password);

            // send the request...
            request(options, function(err, res2, body) {
                if(!parseResponseBody(err, res2, body))
                    return;
                else
                    res.redirect(   JSON.parse(body).url   );
            });
        }
    ]);

    //***********************************************************************************************
    // --- HELPER FUNCTIONS ---
    //***********************************************************************************************
    function initializeRequest(url, method, body, email, password) {
        var options = {
            "method": method,
            "uri": url,
            "body": body,
            "headers": {}
        };
        addRequestHeaders(options, email, password);
        return options;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function addRequestHeaders(options, email, password) {
        // JSON formatted authentication header (XML format allowed as well)
        dsAuthHeader = JSON.stringify({
            "Username": email,
            "Password": password,
            "IntegratorKey": integratorKey  // global
        });
        // DocuSign authorization header
        options.headers["X-DocuSign-Authentication"] = dsAuthHeader;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function parseResponseBody(err, res, body) {
        console.log("\r\nAPI Call Result: \r\n", JSON.parse(body));
        if( res.statusCode != 200 && res.statusCode != 201) { // success statuses
            console.log("Error calling webservice, status is: ", res.statusCode);
            console.log("\r\n", err);
            return false;
        }
        return true;
    }

}

exports.reutrnurl = function(req, res) {
     console.log(req.query);
     console.log(req.body);
     res.send("Signing is done");
}







/*

http://rest-examples.chilkat.io/docusign/nodejs/default.cshtml
https://medium.com/brandsoft/using-a-refresh-token-to-obtain-an-access-token-from-docusign-3c297eb51886
https://developers.docusign.com/platform/auth/jwt/jwt-get-token/
https://arjunphp.com/docusign-create-a-envelope-node-js
https://github.com/vbuch/node-signpdf


https://blogs.sap.com/2020/01/02/electronic-contract-signing-docusign-integration-with-successfactors-part-1/
https://blogs.sap.com/2020/01/02/electronic-contract-signing-docusign-integration-with-successfactors-part-2/
https://documenter.getpostman.com/view/3967924/RW1Yq1C6


https://developers.docusign.com/docs/esign-rest-api/esign101
https://developers.docusign.com/docs/esign-rest-api/how-to/set-template-tab-values
https://developers.docusign.com/docs/esign-rest-api/how-to/request-signature-in-app-embedded
https://developers.docusign.com/docs/esign-rest-api/how-to/request-signature-in-app-embedded
http://docusign.github.io/docusign-node-client/ApiClient.js.html
*/