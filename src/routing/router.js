const express = require('express');
const contactRoutes = require('./contacts');
const phoneCallsRoutes = require('./phoneCalls');

const router = express.Router();

router.route('/contacts')
    .get(contactRoutes.getContacts);

router.route('/contact')
    .post(contactRoutes.postContact)

router.route('/contact/:id')
    .get(contactRoutes.getContact)
    .put(contactRoutes.updateContact)
    .delete(contactRoutes.deleteContact);

router.get('/', (req, res) => {
    res.json({ message: 'hello' });
});

router.route('/history')
    .get(phoneCallsRoutes.getPhoneCalls)
    .post(phoneCallsRoutes.postPhoneCalls);
module.exports = router;
