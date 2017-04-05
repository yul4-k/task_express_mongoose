var mongoose = require("mongoose");
var ContactModel = require('../src/models/contact');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/app');
var should = chai.should();

chai.use(chaiHttp);

describe('Contacts', () => {
    beforeEach((done) => {
        ContactModel.remove({}, (err) => {
            done();
        });
    });

    describe('/GET contacts', () => {
        it('it should GET all the contacts', (done) => {
            chai.request(server)
                .get('/api/contacts?page=0&limit=5')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST /api/contact', () => {
        it('it should not POST a contact without phoneNumber field', (done) => {
            let contact = {
                lastName: "TestLastName",
                lastName: "TestLastName"
            }
            chai.request(server)
                .post('/api/contact')
                .send(contact)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('phoneNumber');
                    res.body.errors.phoneNumber.should.have.property('kind').eql('required');
                    done();
                });
        });

        it('it should POST a contact ', (done) => {
            let contact = {
                firstName: "TestFirstName",
                lastName: "TestLastName",
                phoneNumber: '111111'
            }
            chai.request(server)
                .post('/api/contact')
                .send(contact)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('success');
                    res.body.data.should.have.property('firstName');
                    res.body.data.should.have.property('lastName');
                    res.body.data.should.have.property('phoneNumber');
                    res.body.data.should.have.property('isExpired');
                    done();
                });
        });

        it('it should not POST a contact if it is already created', (done) => {
            let contact = {
                firstName: "TestFirstName",
                lastName: "TestLastName",
                phoneNumber: '4444'
            }

            chai.request(server)
                .post('/api/contact')
                .send(contact)
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.request(server)
                        .post('/api/contact')
                        .send(contact)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.be.a('object');
                            res.body.should.have.property('errorCode').eql('cannot_create_contact');
                            res.body.should.have.property('reasonCode').eql('already_exists');
                            done();
                        });
                });
        });

        it('it should  POST a contact if it was already deleted', (done) => {
            let contact = new ContactModel({
                firstName: "TestFirstName",
                lastName: "TestLastName",
                phoneNumber: '7777'
            });
            contact.save((err, contact) => {
                chai.request(server)
                    .delete('/api/contact/' + contact._id)
                    .end((err, res) => {
                        res.should.have.status(200);

                        chai.request(server)
                            .post('/api/contact')
                            .send(contact)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('message').eql('success');
                                res.body.data.should.have.property('firstName');
                                res.body.data.should.have.property('lastName');
                                res.body.data.should.have.property('phoneNumber');
                                res.body.data.should.have.property('isExpired');
                                done();
                            });
                    });
            });
        });
    });

    describe('/GET /api/contact/:id contact by id', () => {
        it('it should GET a contact by id', (done) => {
            let contact = {
                firstName: "TestFirstName",
                lastName: "TestLastName",
                phoneNumber: '44444'
            }
            chai.request(server)
                .post('/api/contact')
                .send(contact)
                .end((err, res) => {
                    var id = res.body.data._id;
                    chai.request(server)
                        .get('/api/contact/' + id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body[0].should.have.property('firstName');
                            res.body[0].should.have.property('lastName');
                            res.body[0].should.have.property('phoneNumber');
                            res.body[0].should.have.property('isExpired');
                            res.body[0].should.have.property('_id').eql(id);
                            done();
                        });
                });
        });

    });

    describe('/PUT /api/contact/:id contact', () => {
        it('it should UPDATE a contact by id', (done) => {
            let contact = {
                firstName: "TestFirstName",
                lastName: "TestLastName",
                phoneNumber: '111111',
                isExpired: false
            }
            chai.request(server)
                .post('/api/contact')
                .send(contact)
                .end((err, res) => {
                    var id = res.body.data._id;
                    chai.request(server)
                        .put('/api/contact/' + id)
                        .send({ firstName: "TestFirstName2", phoneNumber: '2222' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message').eql('success');
                            res.body.data.should.have.property('firstName').eql('TestFirstName2');
                            res.body.data.should.have.property('lastName').eql('TestLastName');
                            res.body.data.should.have.property('phoneNumber');
                            res.body.data.should.have.property('isExpired');
                            res.body.data.should.have.property('_id').eql(id);
                            done();
                        });
                });
        });
    });

    describe('/DELETE /api/contact/:id contact', () => {
        it('it should DELETE a contact by id', (done) => {
            let contact = new ContactModel({
                firstName: "TestFirstName",
                lastName: "TestLastName",
                phoneNumber: '111111'
            });
            contact.save((err, contact) => {
                chai.request(server)
                    .delete('/api/contact/' + contact._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('success');
                        res.body.data.should.have.property('isExpired').eql(true);
                        done();
                    });
            });
        });
    });
});
