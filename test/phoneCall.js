var mongoose = require("mongoose");
var PhoneCallModel = require('../src/models/phoneCall');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/app');
var should = chai.should();

chai.use(chaiHttp);

describe('Phone calls', () => {
    
    beforeEach((done) => {
        PhoneCallModel.remove({}, (err) => {
            done();
        });
    });

    describe('/GET history of phone calls', () => {
        it('it should GET all the history of phone calls', (done) => {
            chai.request(server)
                .get('/api/history?page=0&limit=5')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(0);
                    done();
                });
        });
    });

describe('/POST /api/history', () => {

        it('it should POST a phone call ', (done) => {
            let phoneCall = {
                phoneNumber: '3333333',
                eventTime: new Date(),
                duration: 5
            }
            chai.request(server)
                .post('/api/history')
                .send(phoneCall)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('success');
                    res.body.data.should.have.property('phoneNumber');
                    res.body.data.should.have.property('eventTime');
                    res.body.data.should.have.property('duration');
                    console.dir(res.body.data)
                    done();
                });
        });
    });

});
