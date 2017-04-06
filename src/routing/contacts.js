const ContactModel = require('../models/contact');

const handleValidationErrors = (err, res, errorCode) => {
    err.name && 'ValidationError' === err.name ?
        res.status(400).send({
            status: 400,
            errorCode: errorCode,
            reasonCode: err.name,
            errors: err.errors
        }) :
        res.status(500).send(err);
}

/*
 * GET /api/contacts?page=1&limit=2 route to retrieve all the contacts.
 */
const getContacts = (req, res) => {
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
        .lean()
        .exec()
        .then(contacts => {
            ContactModel.find({ isExpired: false }).count().exec()
                .then(count => {
                    const data = {
                        "total": count,
                        "data": contacts,
                        "page": page,
                        "limit": limit
                    };
                    res.json(data);
                })
                .catch(err => res.send(err));
        })
        .catch(err => res.send(err));
}


/*
 * POST /api/contact to save a new contact.
 */
const postContact = (req, res) => {
    const { body: { phoneNumber } } = req;

    ContactModel
        .findOne({ phoneNumber })
        .then(contact => {
            if (contact === null) {
                return ContactModel.create(req.body)
                    .then(contact =>
                        res.json({ message: "success", data: contact }))
                    .catch(err =>
                        handleValidationErrors(err, res, "cannot_create_contact"));
            }

            if (contact && contact.isExpired) {
                const requestBody = req.body;

                const newContactData = Object.assign({}, requestBody, { isExpired: false });
                return ContactModel.findOneAndUpdate({ phoneNumber, isExpired: true }, newContactData, { new: true })
                    .then(contact => res.json({ message: 'success', data: contact }))
                    .catch(err => handleValidationErrors(err, res, "cannot_create_contact"));
            }

            if (contact && !contact.isExpired) {
                res.status(409).send({
                    status: 409,
                    errorCode: 'cannot_create_contact',
                    reasonCode: 'already_exists',
                    message: 'Cannot create new contast. The contact already exists.'
                })
            }
        })
        .catch(err => res.status(500).send(err));
}

/*
 * GET /api/contact/:id route to retrieve a contact by id.
 */
const getContact = (req, res) => {
    ContactModel.find({ isExpired: false, _id: req.params.id })
        .lean() //to get plain js Object
        .then(contact => res.json(contact))
        .catch(err => res.send(err));
}

/*
 * PUT /api/contact/:id to update a contact given its id
 */
const updateContact = (req, res) => {
    const { body, params } = req;

    ContactModel.findOneAndUpdate({ _id: params.id, isExpired: false }, body, { new: true })
        .then(contact =>
            res.json({ message: 'success', data: contact }))
        .catch(err =>
            res.send(err)
        );
}

/*
 * DELETE /api/contact/:id to delete a contact by setting isExpired - true.
 */
const deleteContact = (req, res) => {
    const { params: { id } } = req;
    ContactModel.findOneAndUpdate({ _id: id, isExpired: false }, { isExpired: true }, { new: true })
        .then(contact =>
            res.json({ message: 'success', data: contact }))
        .catch(err => {
            res.send(err)
        });
}

module.exports = { getContacts, postContact, getContact, updateContact, deleteContact };

