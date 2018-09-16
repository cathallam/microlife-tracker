const fs = require('fs');
const path = require('path');

// Create a getActivity controller function
const getActivities = (req, res) => {
  const filePath = path.join(__dirname, 'user.json');

  // Use fs.readFile to retrieve the contents of user.json
  fs.readFile(filePath, 'utf8', (readError, userJson) => {
    if (readError) throw readError;

    // Parse the file contents to a JavaScript object representing the user
    const user = JSON.parse(userJson);
    // Getting a single user activity
    const activities = user.profile.activities;
    const profileActivityId = req.params.profileActivityId;
    // Find an object in the activities array with a matching _id
    // Return a res.send with the object
    if (profileActivityId) {
      const profileActivity = activities.find(activity => activity._id === profileActivityId);

      return res.status(200).send(profileActivity);
    }
    // Respond with a status of 200 and send user.profile.activities.
    res.status(200).send(activities);
  });
};

// Export your createActivity object
module.exports = getActivities;
