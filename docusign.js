const docusign = require('docusign-esign');
const fs = require('fs');
const path  = require('path');

exports.test = async function(req, res){

          
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath("https://demo.docusign.net/restapi");
    dsApiClient.addDefaultHeader('Authorization', `Bearer  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyBsOuD2RREZIVrl2gr2rXALVuV24A5Qq6GNxOwo8GKwfVY9NXKfWrn8+VC4I6y7cPQeKoPbwI7Q3uzgoeJvhcDFkWhs6RlPb5W3tKPtbY/e2JPPfF56RR1MMWU6N2tPAUPY86ku3DNzkn+MyP3fT/oZln5rNblLvmOVXXymtDVLNi1fbhLB0HRVhjdqzuF0xnbEejq5efz6R/DCWcfTDz6Clu5KlRwuZOUKXXiW0KC5PKT8z8Fl3yJXCfQKCrFoZ9g73KTPr8jGazIyD/Z10Mb1TUdIUpfI2jpdf/onlq8nST05nV6er9TjdkZzkqyXyrRn0plOj4kyS3CP2JNn/5wIDAQAB`);
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
        console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
    } catch(err) {
        console.log(err)
    }
    
    
    
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

*/