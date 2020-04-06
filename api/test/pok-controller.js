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
            title: 'Pok title',
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
            tags: ['test', 'another tag'],
            childrenPok: [],
            title: 'Pok title',
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
            tags: ['test', 'another tag'],
            childrenPok: [],
            title: 'Pok title',
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

    it('should add a new pok to the list of poks', async () => {
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
        expect(pok.title).to.be.equal(req.body.title)
    })
});