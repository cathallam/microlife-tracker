const fs = require('fs');
const path = require('path');

// Create a getActivity controller function
const createActivity = (req, res) => {
  const filePath = path.join(__dirname, 'user.json');

  // Use fs.readFile to retrieve the contents of user.json
  fs.readFile(filePath, 'utf8', (readError, userJson) => {
    if (readError) throw readError;

    // Parse the file contents to a JavaScript object representing the user
    const user = JSON.parse(userJson);

    res.status(200).send(user.profile.activities);
  });
};


// Respond with a status of 200 and send user.profile.activities.

// Export your createActivity object
module.exports = getActivities;
