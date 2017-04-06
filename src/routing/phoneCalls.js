const ContactModel = require('../models/contact');
const PhoneCallModel = require('../models/phoneCall');

const createPhoneCall = (res, phoneData, contact) => {
    const newPhoneData = Object.assign({}, phoneData, { contact_id: contact._id});

    PhoneCallModel.create(newPhoneData)
        .then(phoneCall => res.json({ message: "success", data: phoneCall }))
        .catch(err => res.send(err));
}

/*
 * GET /api/history?page=1&limit=2 route to retrieve all the phone calls per page.
 */
const getPhoneCalls = (req, res) => {
    const { query } = req;
    const { limit, page } = query;

    const limitPerPage = !isNaN(limit) && limit > 0 ? limit * 1 : 10;
    const pageNumber = !isNaN(page) && page > 0 ? page * 1 : 1;
    const skip = (pageNumber - 1) * limitPerPage

    PhoneCallModel
        .find({})
        .sort({ eventTime: -1 }) //start from the last calls
        .skip(skip)
        .limit(limitPerPage)
        .populate('contact_id')
        .lean()
        .exec()
        .then(function (phoneCalls) {
            PhoneCallModel.count().exec()
                .then(count => {
                    const data = {
                        "total": count,
                        "data": phoneCalls,
                        "page": pageNumber,
                        "limit": limitPerPage
                    };
                    res.json(data);
                })
                .catch(err => res.send(err));
        })
        .catch(err => res.send(err));
}

/*
 * POST /api/history to save a new contact.
 */
function postPhoneCalls(req, res) {
    const requestBody = req.body;
    const { phoneNumber } = requestBody;
    var newPhoneCall;

    ContactModel
        .findOne({ phoneNumber })
        .then(contact => {
            if (contact === null) {
                const newContactData = {
                    phoneNumber,
                    firstName: null,
                    lastName: null,
                    isExpired: true
                };
                ContactModel.create(newContactData)
                    .then(contact => createPhoneCall(res, requestBody, contact))
                    .catch(err => res.send(err));
            } else {
                createPhoneCall(res, requestBody, contact)
            }
        })
        .catch(err => res.send(err));
}

module.exports = { getPhoneCalls, postPhoneCalls };
