const expect = require('chai').expect;
const sinon = require('sinon');

const mongoose = require('mongoose');

const Pok = require('../models/pok');
const PokController = require('../controllers/pok');

describe('Pok Controller', function() {
    before(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/test-tbok', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        const pok1 = new Pok({
            isPrivate: false,
            tags: ['test', 'another tag'],
            childrenPok: ['5e89420317a85010949d6d0a'],
            title: 'Pok title one',
            content: [
                {
                    nodeType: 'paragraph',
                    data: 'this is a test'
                }
            ],
            isDraft: false,
            parentPok: '5e893dbda49747449c4ce9a9',
            _id: '5e893daaa49747449c4ce9a5'
        });

        const pok2 = new Pok({
            isPrivate: false,
            tags: ['test', 'another tag', 'filter'],
            childrenPok: [],
            title: 'Pok title two',
            content: [
                {
                    nodeType: 'paragraph',
                    data: 'this is a test'
                }
            ],
            isDraft: false,
            _id: '5e893dbda49747449c4ce9a9'
        });

        const pok3 = new Pok({
            isPrivate: false,
            tags: ['test', 'another tag', 'filter'],
            childrenPok: [],
            title: 'Pok title three',
            content: [
                {
                    nodeType: 'paragraph',
                    data: 'this is a test'
                }
            ],
            isDraft: false,
            _id: '5e89420317a85010949d6d0a'
        });
        await pok1.save();
        await pok2.save();
        await pok3.save();
    });
    
    after(async () => {
        await Pok.deleteMany({});
        await mongoose.disconnect();
    });

    it('[getPoks] should return all poks', async () => {
        let poks;

        const req = {
            body: {

            }
        }

        const res = {
            status: function(code) {
              return this;
            },
            json: function(data) {
              poks = data.poks;
            }
        };

        await PokController.getPoks(req, res, () => {});

        expect(poks).to.have.length(3);
    });

    it('[getPoks] should return a filtered lists of pok', async () => {
        let poks;

        const req = {
            body: {
                filter: "filter"
            }
        }

        const res = {
            status: function(code) {
              return this;
            },
            json: function(data) {
              poks = data.poks;
            }
        };

        await PokController.getPoks(req, res, () => {});

        expect(poks).to.have.length(2);
    });

    it('[createPok] should add a new pok to the list of poks', async () => {
        const req = {
            body: {
                "title": "This is a brand new pok",
                "content": [
                    {
                        "nodeType": "paragraph",
                        "data": "This pok was used for testing!"
                    }
                ],
                "isPrivate": false,
                "isDraft": true,
                "tags": ["new stuff"]
            }
        }


        let pok;

        const res = {
            status: function(code) {
              return this;
            },
            json: function(data) {
              pok = data.pok;
            }
        };

        await PokController.createPok(req, res, () => {});
        const count = await Pok.countDocuments({});

        expect(count).to.be.equal(4);
        expect(pok.title).to.be.equal(req.body.title);
    })

    it('[deletePok] should remove a pok from the list of poks', async () => {
        const req = {
            params: {
                pokId: "5e89420317a85010949d6d0a"
            }
        }


        let pok;

        const res = {
            status: function(code) {
              return this;
            },
            json: function(data) {
              pok = data.pok;
            }
        };

        await PokController.deletePok(req, res, () => {});
        const count = await Pok.countDocuments({});

        // try to fetch that ID
        expect(count).to.be.equal(3);
    })

    it('[getPok] should return a specific pok', async () => {
        const req = {
            params: {
                "pokId": "5e893daaa49747449c4ce9a5",
            }
        }

        let pok;

        const res = {
            status: function(code) {
              return this;
            },
            json: function(data) {
              pok = data.pok;
            }
        };

        await PokController.getPok(req, res, () => {});

        expect(pok.title).to.be.equal('Pok title one');
    });
});