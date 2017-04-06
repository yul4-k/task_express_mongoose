// не стесняйся использовать let'ы
var express = require('express');
var contactRoutes = require('./contacts');
var phoneCallsRoutes = require('./phoneCalls');

var router = express.Router();

router.use(function (req, res, next) {
    // Лучше не использовать console напрямую.
    // Т.к. всегда есть шанс поменять логгер на, например, отсыл данных на внешний сервак
    // и переделывать весь app будет очень затратно
    console.log('Something is happening.');
    next();
});


// REST хорошо но не для всего подходит
// для обертки над БД хорошо
// Если системя заточена на совершения действий над объектами REST - подходит плохо
// В начале мы использовали REST а потом першли на POST запросы и в итоге это упростило нам жизнь
//    легче расширять роуты, легче добавлять новые параметры
router.route('/contacts')
    .get(contactRoutes.getContacts);

router.route('/contact')
    .post(contactRoutes.postContact) // не забывай про ";"

router.route('/contact/:id')
    .get(contactRoutes.getContact)
    .put(contactRoutes.updateContact)
    .delete(contactRoutes.deleteContact);

router.get('/', function (req, res) {
    res.json({ message: 'hello' });
});

router.route('/history')
    .get(phoneCallsRoutes.getPhoneCalls)
    .post(phoneCallsRoutes.postPhoneCalls);

// лучше отделять, так видно где public часть модуля
module.exports = router;
