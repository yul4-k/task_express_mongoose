const app = require('./app');

var port = process.env.PORT || 8181;
app.listen(port, function () {
    // Лучше не использовать console напрямую.
    // Т.к. всегда есть шанс поменять логгер на, например, отсыл данных на внешний сервак
    // и переделывать весь app будет очень затратно
    console.log('Example app listening on port: ', port)
});
