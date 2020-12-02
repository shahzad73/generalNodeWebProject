const docusign = require('docusign-esign');
const fs = require('fs');
const path  = require('path');

const base64 = require('base64url');
const crypto = require('crypto');
const signatureFunction = crypto.createSign('RSA-SHA256');


exports.test = async function(req, res){
    
var     async = require("async"),       // async module
    request = require("request"),       // request module
    email = "shahzad_73@yahoo.com",              // your account email
    password = "abc@123456",         // your account password
    integratorKey = "7b1338e4-8a21-4a6a-af6c-3a1957a23971",    
    recipientName = "shahzad73@hotmail.com",          // recipient (signer) name
    templateId = "2e744f08-9dd4-4822-81ba-c4a272bb6de7",    
    templateRoleName = "Signer",        // template role that exists on template referenced above
    baseUrl = "",               // we will retrieve this
    envelopeId = "bc14310c-57c0-4168-91be-1fb71ea24c1c";            // created from step 2

    
async.waterfall(
    [
        //////////////////////////////////////////////////////////////////////
        // Step 1 - Login (used to retrieve accountId and baseUrl)
        //////////////////////////////////////////////////////////////////////
        function(next) {
            var url = "https://demo.docusign.net/restapi/v2/login_information";
            var body = "";  // no request body for login api call

            // set request url, method, body, and headers
            var options = initializeRequest(url, "GET", body, email, password);

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
            var url = baseUrl + "/envelopes";
            var body = JSON.stringify({
                "emailSubject": "DocuSign API call - Embedded Sending Example",
                "templateId": templateId,
                "templateRoles": [{
                    "email": email,
                    "name": recipientName,
                    "roleName": templateRoleName,
                    "clientUserId": "1001"  // user-configurable
                }],
                "status": "sent"
            });

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
                "returnUrl": "http://localhost:3000/docusignreturn",
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
    
    
    //2e744f08-9dd4-4822-81ba-c4a272bb6de7         template id
    
    
    /*
   
    dsApiClient.setBasePath("https://demo.docusign.net/restapi");
    
    
        var MILLESECONDS_PER_SECOND = 1000,
              JWT_SIGNING_ALGO = "RS256",
              now = Math.floor(Date.now() / MILLESECONDS_PER_SECOND),
              later = now + expiresIn,
              jwt = require('jsonwebtoken'),
              parsedScopes = Array.isArray(scopes) ? scopes.join(' ') : scopes;
        var jwtPayload = {
              iss: clientId,
              aud: oAuthBasePath,
              iat: now,
              exp: later,
              scope: parsedScopes,
        };    

    
        const headerObj = {
            alg: 'RS256',
            typ: 'JWT'
        };

        const payloadObj = {
            sub: '1234567890',
            name: 'John Doe',
            admin: true,
            iat: 1516239022
        };

        const headerObjString = JSON.stringify(headerObj);
        const payloadObjString = JSON.stringify(payloadObj);

        const base64UrlHeader = base64(headerObjString);
        const base64UrlPayload = base64(payloadObjString);

        signatureFunction.write(base64UrlHeader + '.' + base64UrlPayload);
        signatureFunction.end();

        console.log(  signatureFunction.toString()  )
    
        // The private key without line breaks
        const PRIV_KEY = fs.readFileSync(__dirname + '/Docs/docusign_privatekey.txt', 'utf8');

        // Will sign our data and return Base64 signature (not the same as Base64Url!)
        const signatureBase64 = signatureFunction.sign(PRIV_KEY, 'base64');
        
        const signatureBase64Url = base64.fromBase64(signatureBase64);

    
    
    
    dsApiClient.addDefaultHeader('Authorization', `Bearer ` + signatureBase64Url);
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient)
      , results = null;


    // Data for this method
    // args.signerEmail 
    // args.signerName 
    // args.signerClientId
    // demoDocsPath (module constant)
    // pdf1File (module constant)

    // document 1 (pdf) has tag /sn1/
    //
    // The envelope has one recipients.
    // recipient 1 - signer
  
    let docPdfBytes;
    // read file from a local directory
    // The read could raise an exception if the file is not available!
    docPdfBytes = fs.readFileSync(path.resolve("/home/shahzad/Temp", "sign.pdf"));
  
    // create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = 'Please sign this document';
  
    // add the documents
    let doc1 = new docusign.Document()
      , doc1b64 = Buffer.from(docPdfBytes).toString('base64')
      ;
  
    doc1.documentBase64 = doc1b64;
    doc1.name = 'SigningForm'; // can be different from actual file name
    doc1.fileExtension = 'pdf';
    doc1.documentId = '3';
  
    // The order in the docs array determines the order in the envelope
    env.documents = [doc1];
  
    // Create a signer recipient to sign the document, identified by name and email
    // We set the clientUserId to enable embedded signing for the recipient
    // We're setting the parameters via the object creation
    let signer1 = docusign.Signer.constructFromObject({
        email: "shahzad73@hotmail.com",
        name: "Shahzad Aslam", 
        clientUserId: "SH12345",
        recipientId: 1    
    });
    
    // Create signHere fields (also known as tabs) on the documents,
    // We're using anchor (autoPlace) positioning
    //
    // The DocuSign platform seaches throughout your envelope's
    // documents for matching anchor strings. 
    let signHere1 = docusign.SignHere.constructFromObject({
          anchorString: '/sn1/',
          anchorYOffset: '10', anchorUnits: 'pixels',
          anchorXOffset: '20'})
      ;
  
    // Tabs are set per recipient / signer
    let signer1Tabs = docusign.Tabs.constructFromObject({
      signHereTabs: [signHere1]});
    signer1.tabs = signer1Tabs;

    // Add the recipient to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
      signers: [signer1]});
    env.recipients = recipients;

    // Request that the envelope be sent by setting |status| to "sent".
    // To request that the envelope be created as a draft, set to "created"
    env.status = 'sent';
      
    let envelope = env;

    try {
            // Call Envelopes::create API method
            // Exceptions will be caught by the calling function
            results = await envelopesApi.createEnvelope("889d8b93-7f8a-4c95-a7b5-1ab040f9dfbc", {envelopeDefinition: envelope});

            let envelopeId = results.envelopeId;
            res.send(`Envelope was created. EnvelopeId ${envelopeId}`);
    } catch(err) {
            console.log(err)
    }
    */
    

    
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