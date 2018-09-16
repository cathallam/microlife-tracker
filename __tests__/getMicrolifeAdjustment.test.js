const fs = require('fs');
const path = require('path');
const events = require('events');
const httpMocks = require('node-mocks-http');
const getMicrolifeAdjustment = require('../controllers/getMicrolifeAdjustment');

// Add a new test to the profile and expect 2 assertions
describe('getMicrolifeAdjustment', () => {
  it('gets the user\'s microlife adjustment for the day', (done) => {
    expect.assertions(2);
    // Create the user object
    const user = {
      profile: {
        activities: [{
          activityId: 'walk',
          quantity: 1,
        }, {
          activityId: 'meat',
          quantity: 2,
        }, {
          activityId: 'tv',
          quantity: 1,
        }],
      },
    };

    // Write to user.json object - you'll need to convert it to a JSON string first
    const filePath = path.join(__dirname, '../controllers', 'user.json');
    fs.writeFile(filePath, JSON.stringify(user), () => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/profile/adjustment',
      });

      // Create a mock request object for a GET request to /profile/activities
      // Create a mock response object with an EventEmitter.
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      // Call the controller, passing in the request and response objects
      getMicrolifeAdjustment(request, response);

      // Add an event listener to the response, listening in for an on event.
      // Add response status code 200
      response.on('end', () => {
        expect(response.statusCode).toEqual(200);
        // Expect the response data (response.getData()) to equal { dayTotal: 47 }.
        expect(response._getData()).toEqual(expect.objectContaining({ dayTotal: 47 }));

        done();
      });
    });
  });
  // Reset your file prior to the test starting (the teardown of your test)
  afterEach(() => {
    const filePath = path.join(__dirname, '../controllers', 'user.json');
    fs.writeFileSync(filePath, '{"profile":{"activities":[]}}');
  });
});
