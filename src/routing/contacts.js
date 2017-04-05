var ContactModel = require('../models/contact');
var mongoose = require('mongoose');

/*
 * GET /api/contacts?page=1&limit=2 route to retrieve all the contacts.
 */
function getContacts(req, res) {
    var query = req.query;
    var limitParam = query.limit;
    var pageParam = query.page;
    var limit = !isNaN(limitParam) && limitParam > 0 ? limitParam * 1 : 10;
    var page = !isNaN(pageParam) && pageParam > 0 ? pageParam * 1 : 1;
    var skip = (page - 1) * limit

    ContactModel
        .find({ isExpired: false })
        .sort({ firstName: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(function (err, contacts) {
            if (err) res.send(err);
            ContactModel.find({ isExpired: false }).count().exec(function (err, count) {
                if (err) res.send(err);
                const data = {
                    "total": count,
                    "data": contacts,
                    "page": page,
                    "limit": limit
                }
                res.json(data);
            });
        });
}


/*
 * POST /api/contact to save a new contact.
 */
function postContact(req, res) {
    /*
     * 1. find contact with the same phoneNumber
     *      if isExpired === false - error -already exists
     *      if isExpired === true - update record and set to false
     * if not exists - create new
     * 
     */

    ContactModel
        .findOne({ phoneNumber: req.body.phoneNumber }, function (err, contact) {
            if (err) {
                res.status(500).send(err);
            } else if (contact === null) {
                var newContact = new ContactModel(req.body);
                newContact.save(function (err, contact) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        res.json({ message: "success", data: contact });
                    }
                });
            } else if (contact.isExpired) {
                var requestBody = req.body;
                requestBody.isExpired = false;
                ContactModel.findOneAndUpdate({ phoneNumber: req.body.phoneNumber, isExpired: true }, requestBody, { new: true }, function (err, contact) {
                    if (err) res.status(500).send(err);
                    res.json({ message: 'success', data: contact });
                });
            } else {
                res.status(409).send({
                    errorCode: 'cannot_create_contact',
                    reasonCode: 'already_exists'
                })
            }            
        });   
}

/*
 * GET /api/contact/:id route to retrieve a contact by id.
 */
function getContact(req, res) {
    ContactModel.find({ isExpired: false, _id: req.params.id }, function (err, contact) {
        if (err) res.send(err);
        res.json(contact);
    });
}

/*
 * PUT /api/contact/:id to update a contact given its id
 */
function updateContact(req, res) {
    var requestBody = req.body

    ContactModel.findOneAndUpdate({ _id: req.params.id, isExpired: false }, requestBody, { new: true }, function (err, contact) {
        if (err) res.send(err);
        res.json({ message: 'success', data: contact });
    });
}

/*
 * DELETE /api/contact/:id to delete a contact by setting isExpired - true.
 */
function deleteContact(req, res) {
    ContactModel.findOneAndUpdate({ _id: req.params.id, isExpired: false }, { isExpired: true }, { new: true }, function (err, contact) {
        if (err) res.send(err);
        res.json({ message: 'success', data: contact });
    });
}

module.exports = { getContacts, postContact, getContact, updateContact, deleteContact };

