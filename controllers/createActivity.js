const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v5');

const createActivity = (req, res) => {
  const filePath = path.join(__dirname, 'user.json');

  // Use fs.readFile to retrieve the contents of user.json
  fs.readFile(filePath, 'utf8', (readError, userJson) => {
    if (readError) throw readError;

    // Parse the file contents to a JavaScript object representing the user
    const user = JSON.parse(userJson);

    // Use Object.assign to create a new activity object by combining an empty object literal
    // The request body (req.body) and a new object with an _id key set to the activityId variable
    const activityId = uuid();
    const activity = Object.assign({}, req.body, { _id: activityId });
    user.profile.activities.push(activity);

    fs.writeFile(filePath, JSON.stringify(user), (writeError) => {
      if (writeError) throw writeError;
      res.status(200).send({ profileActivityId: activityId });
    });
  });
};

module.exports = createActivity;
