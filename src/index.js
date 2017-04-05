const app = require('./app');

var port = process.env.PORT || 8181;
app.listen(port, function () {
    console.log('Example app listening on port: ', port)
});
