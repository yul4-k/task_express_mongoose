var express = require('express');
var contactRoutes = require('./contacts');
var phoneCallsRoutes = require('./phoneCalls');

var router = express.Router();

router.use(function (req, res, next) {
    console.log('Something is happening.');
    next();
});

router.route('/contacts')
    .get(contactRoutes.getContacts);

router.route('/contact')
    .post(contactRoutes.postContact)

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
module.exports = router;
