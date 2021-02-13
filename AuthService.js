global.fetch = require('node-fetch');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

global.navigator = () => null;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

//redswan
const poolData = { UserPoolId: "us-east-1_rfyfyirDL",  ClientId: "6en1dkofmfim42po7ucv6auseb" };

//my settings
//const poolData = { UserPoolId: "us-east-1_PpnyIyThu", ClientId: "iq3cbbgogpkbhkpptgqhnd4bf" };


// http://127.0.0.1:3000/auth/register?name=sa@digishares.io&email=sa@digishares.io&password=Allahis@11&given_name=ShahzadSA&family_name=DigiShares
const pool_region = "us-east-1";
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);



exports.Register = function (body, callback) {
   var name = body.name;
   var email = body.email;
   var password = body.password;
   var givenname = body.given_name;
   var familyname = body.family_name

   var attributeList = [];
   
    attributeList.push(new    AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
    attributeList.push(new    AmazonCognitoIdentity.CognitoUserAttribute({ Name: "given_name", Value: givenname }));
    attributeList.push(new    AmazonCognitoIdentity.CognitoUserAttribute({ Name: "family_name", Value: familyname }));
    
    userPool.signUp(name, password, attributeList, null, function (err, result) {
        if (err)            
            callback(err);

        var cognitoUser = result.user;

        //console.log(cognitoUser);
        
        callback(null, cognitoUser);
   })
}

//my              http://127.0.0.1:3000/auth/login?name=sa@digishares.io&password=Allahis@11
//redswan      http://127.0.0.1:3000/auth/login?name=shahzad@hotmail.com&password=Password1234
exports.Login = function (body, callback) {
   var userName = body.name;
   var password = body.password;
   var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: userName,
        Password: password
    });
    var userData = {
        Username: userName,
        Pool: userPool
    }
    console.log()
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
           var accesstoken = result.getIdToken().getJwtToken() + "<br><br>" + result.getRefreshToken().getToken() ;
            
           callback(null, accesstoken);
        },
        onFailure: (function (err) {
           callback(err);
       })
   })
};


//http://127.0.0.1:3000/auth/validate?token=
exports.Validate = function(token, callback){

   request({
       url : `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
       json : true
    }, function(error, response, body){

       if (!error && response.statusCode === 200) {
           pems = {};
           var keys = body['keys'];
           for(var i = 0; i < keys.length; i++) {
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = { kty: key_type, n: modulus, e: exponent};
                var pem = jwkToPem(jwk);
                pems[key_id] = pem;
           }
        var decodedJwt = jwt.decode(token, {complete: true});
           
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    callback(new Error('Not a valid JWT token'));
                }
                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    console.log('Invalid token');
                    callback(new Error('Invalid token'));
                }
               jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                        console.log("Invalid Token.");
                        callback(new Error('Invalid token'));
                    } else {
                         //var base64Url = token.split('.')[0];
                         //var base64 = base64Url.replace('-', '+').replace('_', '/');
                         //console.log(Buffer.from(base64, 'base64').toString());
                        
                         console.log(  decodedJwt.payload.email   )
                        
                         callback(null, "Valid token");
                    }
               });
       } else {
             console.log("Error! Unable to download JWKs");
             callback(error);
       }
   });
    
}


exports.getuserData = function(callback) {
            var params = {
            AccessToken:  "eyJraWQiOiJRWUtsVGI0alFGYWZMMW1oRHE1bERnWUFGTmxBYWlOQjc0NFBmb2RxSjhjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ODE0MzhmYS1kNjgzLTQxZDYtYmI5MC1lOTM5NjA0NjAwNjIiLCJldmVudF9pZCI6Ijc5OThjYWE1LWNhNjUtNDI2MC1iNDE3LTBiZGY1YmFjODUyMiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1OTkwNjcwMzEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1BwbnlJeVRodSIsImV4cCI6MTU5OTA3MDYzMSwiaWF0IjoxNTk5MDY3MDMxLCJqdGkiOiI2NGIyMWQyZC05NjM5LTRhM2MtYTE0Zi02Nzk3ZjU5YmM5ZmUiLCJjbGllbnRfaWQiOiJpcTNjYmJnb2dwa2Joa3BwdGdxaG5kNGJmIiwidXNlcm5hbWUiOiJzaGFoemFkIn0.PZ0In-oJxDuf_X7EEnQvVVBQMaIvrgtbntq03xzbqcKkyYLv1rj7GJfwRshFr2MIUjIHVeWepk5VKe61YCKDePTsgjmaQucAwEx2buReaQ797SU76A2t7RVAUmHjb6CDiQa0UpJhILQvmW2KVAUluahWOip_5C1bi0w-4MqxwgI7wIWxRTK6WZwdAWyh_YAmd_dg9rNLEcxsRBdEZqVPgvmmLumhglkfhU7WbSOB3RMCZV7PA1nskPkDfjHRpk9Qsxtgai0DdNkZyJaWz1wuK06h21vMDLvMjEIxVw_vIosVGyIWlUNgOkr8J302Hzpz5CFtkMv8nHMQr9Ton6goeg"
        };
        //var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

        AmazonCognitoIdentity.getUser(params, function(err, data) {
         if (err) {
            console.log(err, err.stack);
         } // an error occurred
         else{
            console.log(data);
         } // successful response
         })
}


// http://127.0.0.1:3000/auth/checkJWTToken
exports.checkjwttokens=function(body, callback) {

        const jwt = require("jsonwebtoken");
        var jwkToPem = require('jwk-to-pem');
    
        jwk = { keys:
           [ { alg: 'RS256',
               e: 'AQAB',
               kid: 'WNhkMdzA5d6nCTsxAE9aYyQ/zWoJgLYyPAadpcR8sYM=',
               kty: 'RSA',
               n:
        'q_1kuO5JGAAPr8JVpriSLTWt1xrsHyCI7HojsxD2xJRpicADMN8giNWTYp16VOpWyw5UuAa7I0BCQELOef2gTzxtVCJ5IpcVsEZJPP8aUKlF6GbJh2urrsUnje-c50DJAlKgBpmMJgADO2ZobtavXaqciQFAt4ifyT9MA9SlWOk56owiBO7gqsFBgZlRoOcuCS_yYNDge571VwmGOXTD8jlbRaR4IEdFE4kmLzXLLzvsvPc8cVrOkJFv4Zl2tZcF0-b_W_HYDA1q_uF04qznu8F0kjd1IQ6EZPSPdyvGEkheHHLcsyoggj3U76jei_15goABTVYal3UskI9fcQOGPQ',
               use: 'sig' },
             { alg: 'RS256',
               e: 'AQAB',
               kid: 'QYKlTb4jQFafL1mhDq5lDgYAFNlAaiNB744PfodqJ8c=',
               kty: 'RSA',
               n:
                'iAaMiGdulLtyl05vyQ0edGqVn8nDvM1WC7fwYr9alOyW6YDDk4JoboyKy3-moMUng6q5LZEkqD2XzmQh1mDNuDwGZqqrm5rdu6XmHL0Cc2oRpUI7eZgLvg2NVWE3D2D7vAUjYAJ5vPRqXZpEUE0XmFv-aRs0ncFlR5jTo5rzHhBd_xaQnKtP3bDx_SarNZeEObHWvD3mvSz_kZRCT_jKo-WgenSyRVtpPxd5KBwVOH2fx_fLGJ3bKs8sy8y_5McZN_rmPAaiV-ca1_fysUY7nMdGxIF7Ru8_XasV4YvAjW8fkAWgSOR5-2NPVM0Wczbn8TDP-5vuV6hO_epRWQgfXQ',
               use: 'sig' 
        } ] };    

        var pem = jwkToPem( jwk.keys[1] );
    token=`eyJraWQiOiJRWUtsVGI0alFGYWZMMW1oRHE1bERnWUFGTmxBYWlOQjc0NFBmb2RxSjhjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ODE0MzhmYS1kNjgzLTQxZDYtYmI5MC1lOTM5NjA0NjAwNjIiLCJldmVudF9pZCI6IjJjMWNmNTc5LTY4ZjQtNGM0NC05MjE3LWRkMGFjNzc1NDlhNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1OTk1ODg5OTUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1BwbnlJeVRodSIsImV4cCI6MTU5OTU5MjU5NSwiaWF0IjoxNTk5NTg4OTk1LCJqdGkiOiJhZWQyMjllYy1hY2UxLTQwMzAtYTZjNC1hNmY5NjM5NTIzYjIiLCJjbGllbnRfaWQiOiJpcTNjYmJnb2dwa2Joa3BwdGdxaG5kNGJmIiwidXNlcm5hbWUiOiJzaGFoemFkIn0.UOISPfc4d_DkLuWItk_wupGkfZOoJjPnKyz-pndJ99r3PRwerMI6-u_qPKclGsyS8dGQ509riEay1vOQnzDMbbxe7DKZvmcdl6jWEGnAXrFB8WdKHk0JfQnDpyryEPZ2YeI_rd4uNjZzN0Mii5cgoeV34k2NvUYfKCsV3TUtt-pdZGRUcTcenYAW17AqnPVw2pr-OvpZWsPYxonzmUZREmIXvIDgHsLpk87QkHeDRSwSrRROifU3jdvaM7-kjCRE5fla50nA1qvlrx42q5paHJCiap2i_NxeZmzz8qtqtmVwrup7JqZcXUbOOh4uvj4_7VlKnn01ayPyz0fOdbBpMw`;   

        jwt.verify(token, pem, { algorithms: ['RS256'] }, function(err, decodedToken) {

        if(err)
            console.log(err)
        else {
            console.log("...........")
            console.log(decodedToken);
        }

        callback("done")
});
    
    
}





















/*

Cognito Register User

function RegisterUser(){
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:"Prasad Jayashanka"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"preferred_username",Value:"jay"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:"male"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"birthdate",Value:"1991-06-21"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"address",Value:"CMB"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:"sampleEmail@gmail.com"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:"+5412614324321"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:scope",Value:"admin"}));

    userPool.signUp('sampleEmail@gmail.com', 'SamplePassword123', attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
}




function Login() {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : 'sampleEmail@gmail.com',
        Password : 'SamplePassword123',
    });

    var userData = {
        Username : 'sampleEmail@gmail.com',
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
        },
        onFailure: function(err) {
            console.log(err);
        },

    });
}



function update(username, password){
        var attributeList = [];
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "custom:scope",
            Value: "some new value"
        }));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "name",
            Value: "some new value"
        }));
  
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.updateAttributes(attributeList, (err, result) => {
            if (err) {
                //handle error
            } else {
                console.log(result);
            }
        });
}




function ValidateToken(token) {
        request({
            url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body['keys'];
                for(var i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent};
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                //validate the token
                var decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    return;
                }

                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    console.log('Invalid token');
                    return;
                }

                jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                        console.log("Invalid Token.");
                    } else {
                        console.log("Valid Token.");
                        console.log(payload);
                    }
                });
            } else {
                console.log("Error! Unable to download JWKs");
            }
        });
}




function renew() {
    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: "your_refresh_token_from_a_previous_login"});

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const userData = {
        Username: "sample@gmail.com",
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
            console.log(err);
        } else {
            let retObj = {
                "access_token": session.accessToken.jwtToken,
                "id_token": session.idToken.jwtToken,
                "refresh_token": session.refreshToken.token,
            }
            console.log(retObj);
        }
    })
}







function DeleteUser() {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.deleteUser((err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully deleted the user.");
                        console.log(result);
                    }
                });
            },
            onFailure: function (err) {
                console.log(err);
            },
        });
}








function deleteAttributes(username, password){
        var attributeList = [];
        attributeList.push("custom:scope");
        attributeList.push("name");
  
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.deleteAttributes(attributeList, (err, result) => {
            if (err) {
                //handle error
            } else {
                console.log(result);
            }
        });
}










function ChangePassword(username, password, newpassword) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.changePassword(password, newpassword, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully changed password of the user.");
                        console.log(result);
                    }
                });
            },
            onFailure: function (err) {
                console.log(err);
            },
        });
}











*/
