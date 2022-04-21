const chai = require('chai');
const assert = chai.assert; 

const { getUserByEmail } = require('../helper.js');

// getUserByEmail Test
const testUsers = {
    "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
    }
};

describe('getUserByEmail', function () {
    it('should return a user with a valid email', function () {
        const user = getUserByEmail("user@example.com", testUsers)
        assert.equal(user.id, 'userRandomID');
    });
    it('should return undefined when looking for a non-existent email', function() {
        const user = getUserByEmail('nothere@oops.com', testUsers);
        assert.equal(user, undefined);
    });
});






