const fs = require('fs');
const path = require('path');

// Create a getMicrolifeAdjustment controller function
const getMicrolifeAdjustment = (req, res) => {
  const MICROLIVES_IN_DAY = 48;

  const userJsonPath = path.join(__dirname, 'user.json');

  fs.readFile(userJsonPath, 'utf8', (userErr, userJson) => {
    if (userErr) throw userErr;

    const activitiesJsonPath = path.join(__dirname, 'activities.json');
    fs.readFile(activitiesJsonPath, 'utf8', (activitiesErr, activitiesJson) => {
      if (activitiesErr) throw activitiesErr;

      const user = JSON.parse(userJson);
      const activities = JSON.parse(activitiesJson).activities;

      // Map over the user's activities (user.profile.activities) and inside the map
      const profileActivities = user.profile.activities.map((profileActivity) => {
        const getActivityById = activity => activity._id === profileActivity.activityId;
        const matchingActivity = activities.find(getActivityById);

        return Object.assign(matchingActivity, profileActivity);
      });
      // Array returned by map, use Array.prototype.reduce() to total effect field (our adjustment)
      const totalAdjustment = (total, activity) => total + (activity.effect * activity.quantity);
      const adjustment = profileActivities.reduce(totalAdjustment, 0);

      res.status(200).send({ dayTotal: MICROLIVES_IN_DAY + adjustment });
    });
  });
};

module.exports = getMicrolifeAdjustment;
