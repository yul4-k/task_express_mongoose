// Это нода, детка:) Не бойся использовать фишки ES6
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('./mongoose');
var router = require('./routing/router') // не забывай про ";"

// Зачем тебе нужны все эти парсеры. Обычно лучше иметь только один формат для приема и передачи данных
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' })); // На мой взгляд это самый правильный

app.use('/api', router);
app.use("*", function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    // Здесь лучше всего делать единый формат отдачи данных
    // у нас на проекте мы всегда отдаем JSON и принимаем JSON
    // и это мне кажется верным путем. Строгий протокол передачи данных
    // Например:
    // {
    //     "status": "success",
    //     "data": {
    //         // some data
    //     }
    // }
    // Или
    // {
    //     "status": "fail",
    //     "data": {
    //         "message": "Message",
    //         // some additional data
    //     }
    // }
    res.status(err.status || 500).send(err);
});

module.exports = app;
