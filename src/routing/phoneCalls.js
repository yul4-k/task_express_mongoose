var ContactModel = require('../models/contact');
var PhoneCallModel = require('../models/phoneCall');
var mongoose = require('mongoose');

function createPhoneCall(res, phoneData, contact) {
    phoneData.contact_id = contact._id
    var newPhoneCall = new PhoneCallModel(phoneData);
    newPhoneCall.save(function (err, phoneCall) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json({ message: "success", data: phoneCall });
        }
    });
}

/*
 * GET /api/history?page=1&limit=2 route to retrieve all the phone calls per page.
 */
function getPhoneCalls(req, res) {
    var query = req.query;
    var limitParam = query.limit;
    var pageParam = query.page;
    var limit = !isNaN(limitParam) && limitParam > 0 ? limitParam * 1 : 10;
    var page = !isNaN(pageParam) && pageParam > 0 ? pageParam * 1 : 1;
    var skip = (page - 1) * limit

    PhoneCallModel
        .find({})
        .sort({ eventTime: -1 }) //start from the last calls
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('contact_id')
        .exec(function (err, phoneCalls) {
            if (err) res.send(err);
            PhoneCallModel.count().exec(function (err, count) {
                if (err) res.send(err);
                const data = {
                    "total": count,
                    "data": phoneCalls,
                    "page": page,
                    "limit": limit
                }
                res.json(data);
            });
        });
}

/*
 * POST /api/history to save a new contact.
 */
function postPhoneCalls(req, res) {
    //1. find contact by phone,
    //1.a set its id as contact_id for phoneCall
    //    2. save phoneCall data
    //1.b create new unknown contact with phone and
    //    set its id as contact_id for phoneCall
    //    2. save phoneCall data
    var requestBody = req.body;
    var phoneNumber = requestBody.phoneNumber
    var newPhoneCall;

    ContactModel
        .findOne({ phoneNumber: phoneNumber }, function (err, contact) {
            if (err) {
                res.send(err);
            } else if (contact === null) {
                //create new contact
                var newContact = new ContactModel({
                    phoneNumber: req.body.phoneNumber,
                    firstName: null,
                    lastName: null,
                    isExpired: true
                });
                newContact.save(function (err, contact) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        createPhoneCall(res, requestBody, contact)
                    }
                });
            } else {
                createPhoneCall(res, requestBody, contact)
            }
        });
}

module.exports = { getPhoneCalls, postPhoneCalls };
