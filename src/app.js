const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('./mongoose');
const router = require('./routing/router');

app.use(bodyParser.json({ type: 'application/json' }));

app.use('/api', router);
app.use("*", (req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    //to do : responce format
    res.status(err.status || 500).send(err);
});

module.exports = app;
