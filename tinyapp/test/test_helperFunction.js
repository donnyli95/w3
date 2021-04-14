// import data
const { urlDatabase } = require('../data');
const { users } = require('../data');

// import helper functions
const { generateRandomString } = require("../helperFunctions");
const { emailExists } = require("../helperFunctions");
const { passwordMatch } = require("../helperFunctions");
const { getID } = require("../helperFunctions");
const { urlsForUser } = require("../helperFunctions");

//chai
const assert = require("chai").assert;

//hashing password with bcrypt
const bcrypt = require('bcrypt');

describe("generateRandomString", function() {
  it("should return a string", function() {
    const result = generateRandomString();
    assert.equal(typeof result, 'string');

  });

  it("should be 6 characters long", function() {
    const result = generateRandomString();
    assert.equal(result.length, 6);
  });
});

describe("emailExists", function() {
  it("should return true if email exists in database", function() {
    const result = emailExists("bun@bun.com", users);
    assert.isTrue(result);

  });

  it("should return false if email does not exist in database", function() {
    const result = emailExists("123", users);
    assert.isFalse(result);
  });
});

describe("passwordMatch", function() {
  it("should return true if passwords match", function() {
    const result = passwordMatch("bun@bun.com", "bunbun", users);
    assert.isTrue(result);

  });

  it("should return false if passwords don't match", function() {
    const result = passwordMatch("bun@bun.com", "cheese", users);
    assert.isFalse(result);
  });
});

describe("getID", function() {
  it("returns ID of email user", function() {
    const result = getID("bun@bun.com", users);
    assert.equal(result, 'bunbun');

  });

  it("returns undefined otherwise", function() {
    const result = getID();
    assert.equal(result, undefined);
  });
});

describe("urlsForUser", function() {
  it("returns object of URLs for given ID", function() {
    const result = urlsForUser("bunbun", urlDatabase);
    const expected = {
      bunbu1: { longURL: 'https://www.crunchyroll.com', userID: 'bunbun' },
      bunbu2: { longURL: 'https://www.lighthouselabs.ca/', userID: 'bunbun' },
    }
    console.log(result.length);
      assert.deepEqual(result, expected);
  });

  it("returns empty object otherwise", function() {
    const result = urlsForUser();
    assert.deepEqual(result, {});
  });
});
