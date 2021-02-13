const https = require('https')
const fs = require('fs');

var app = require('./app');


// For https use the following link for setting up self signed certificate
// https://flaviocopes.com/express-https-self-signed-certificate/   
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(3000, () => {
  console.log('Listening...')
})


/*var server = app.listen(3000, function(){
     console.log("Server is running on port 3000");
});*/
