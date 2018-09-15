const fs = require('fs');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const createActivity = require('../controllers/createActivity');

// Use jest.mock to override the return value of the uuid module
// with a function that returns abc123 when called.
jest.mock('uuid/v5', () => jest.fn(() => 'abc123'));

// Add a new test it adds an activity to the profile and expect 2 assertions
describe('createActivity', () => {
  it('adds an activity to the profile', (done) => {
    expect.assertions(2);

    // Created a mock request and mock response object.
    // Provide mock request object the following body
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/profile/activities',
      body: {
        activityId: 'short-walk',
        quantity: 1,
      },
    });
    //  Adding eventEmitter property to mock response object with the value events.EventEmitter
    const response = httpMocks.createResponse({
      eventEmitter: events.EventEmitter,
    });

    // Call createActivity passing in the request and response objects
    createActivity(request, response);

    // Adding event listener to the response object, listening for the on event
    response.on('end', () => {
      const filePath = path.join(__dirname, '../controllers', 'user.json');

      // Event listener callback, using fs.readFile to read the contents of the user.json file
      // Assert that response.statusCode is equal to 200
      fs.readFile(filePath, 'utf8', (error, userJson) => {
        expect(response.statusCode).toEqual(200);

        // Parse the returned file contents to JavaScript
        // Assert that profile.activities contains the following & complete test with done
        const user = JSON.parse(userJson);
        const activity = Object.assign(request.body, { _id: 'abc123' });
        expect(user.profile.activities).toContainEqual(expect.objectContaining(activity));
        done();
      });
    });
  });

  // In an afterEach block, reset file to how it was prior to the test starting
  afterEach(() => {
    const filePath = path.join(__dirname, '../controllers', 'user.json');
    fs.writeFileSync(filePath, '{"profile":{"activities":[]}}');
  });
});
