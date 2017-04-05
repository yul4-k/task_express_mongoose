var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('./mongoose');
var router = require('./routing/router')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.use('/api', router);
app.use("*", function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500).send(err);
});

module.exports = app;
