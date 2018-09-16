const fs = require('fs');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const getActivities = require('../controllers/getActivities');

// Add a new test it adds an activity to the profile and expect 2 assertions
describe('GetActivity', () => {
  it('Gets an activity from the user\'s profile', (done) => {
    expect.assertions(2);
    // Create the user object
    const user = {
      profile: {
        activities: [{
          activityId: 'short-walk',
          quantity: 1,
        }, {
          activityId: 'red-meat',
          quantity: 2,
        }],
      },
    };
      // Write to user.json object - you'll need to convert it to a JSON string first
    const filePath = path.join(__dirname, '../controllers', 'user.json');

    fs.writeFile(filePath, JSON.stringify(user), () => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/profile/activities',
      });
        // Create a mock request object for a GET request to /profile/activities
        // Create a mock response object with an EventEmitter.
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      // Call the controller, passing in the request and response objects
      getActivities(request, response);
      // Add an event listener to the response, listening in for an on event.
      // Add response status code
      response.on('end', () => {
        expect(response.statusCode).toEqual(200);
        expect(response._getData()).toEqual(user.profile.activities);

        done();
      });
    });
  });

  it('gets a single user activity', (done) => {
    expect.assertions(2);

    const user = {
      profile: {
        activities: [{
          _id: 'abc123',
          activityId: 'short-walk',
          quantity: 1,
        }, {
          _id: 'def456',
          activityId: 'red-meat',
          quantity: 2,
        }],
      },
    };
    // Write to user.json and convert it to a JSON string.
    const filePath = path.join(__dirname, '../controllers', 'user.json');

    fs.writeFile(filePath, JSON.stringify(user), () => {
      // Mock request object for a GET request to /profile/activities/def456.
      // It should also have a params key with a value of { profileActivityId: 'def456' }
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/profile/activities/def456',
        params: {
          profileActivityId: 'def456',
        },
      });
      // create a mock request object for a GET request to /profile/activities
      // Create a mock response object with an EventEmitter.
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      // Call your controller, passing in the request and response objects.
      getActivities(request, response);
      // Add an event listener to the response, listening in for an on event.
      response.on('end', () => {
        expect(response.statusCode).toEqual(200);
        // Expect the response data (response.getData()) to equal the object with the _id of def456
        // (use expect.objectContaining to match the keys and values).
        expect(response._getData()).toEqual(expect.objectContaining(user.profile.activities[1]));

        done();
      });
    });
  });
  // Reset your file to how it was prior to the test starting (the teardown of your test).
  afterEach(() => {
    const filePath = path.join(__dirname, '../controllers', 'user.json');
    fs.writeFileSync(filePath, '{"profile":{"activities":[]}}');
  });
});
