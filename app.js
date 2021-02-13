var express = require('express');
var app = express();

module.exports = app;

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Hello Wfrom nodejs        authentication server'));

app.use(bodyParser.json());

var routes = require('./routes');

app.use('/', routes);

module.exports = app;