Meteor.publish('eaters', function () {
  return Eaters.find({}, { sort: {name: 1} })
})

Meteor.publish('meals', function (limit) {
  limit = limit || 10
  return Meals.find({}, {sort:[['date', 'desc']], limit: limit})
})

Meteor.startup(function () {

  //TODO: prevent editing from anonymous users
  Eaters.allow({
    insert: function (userId, doc) {
      if(!userId) return false
      if(!doc.servings){
        doc.servings = { given:0, received: 0 }
        doc.mealsCooked = 0
      }
      return true
    },
    update: function (userId, doc) {
      if(!userId) return false
      return true
    }
    // TODO: no deleting, just add a flag to hide if needed.
    // userIds are used like foreign keys in Meal documents
  })

  Meals.allow({
    insert:function (userId, doc) {
      if(!userId) return false
      updateStats(doc)
      return true
    },
    update: function (userId, doc) {
      if(!userId) return false
      return true;
    },
    remove: function (userId, doc) {
      if(!userId) return false
      return true;
    }
  })

  // reset stats after change
  Meals.find({}).observeChanges({
    changed: function (id, fields) {
      resetStats()
    }
  })

});

function updateStats (meal) {
  updateChefs(meal)
  updateEaters(meal)
}

// Update stats for the chef
function updateChefs (meal) {
  Eaters.update(
    {'_id': { $in: meal.chef } },
    {
      $inc: {
        'mealsCooked': 1,
        'servings.given': meal.eaters.length
      },
      $set: { lastCooked: meal.date }
    },
    { multi: true }
  )
}

// Update stats for eaters
function updateEaters (meal) {
  Eaters.update(
    { '_id': { $in: meal.eaters } },
    {
      $set: { lastEaten: meal.date },
      $inc: { 'servings.received': 1 }
    },
    { multi: true }
  )
}

// Zero out all the stats and recalculate
function resetStats () {
  Eaters.update(
    { }, // all
    {
      $unset: {
        lastEaten: "",
        lastCooked: ""
      },
      $set: {
        mealsCooked: 0,
        'servings.given': 0,
        'servings.received': 0,
      }
    },
    { multi: true }
  )

  Meals.find().fetch().forEach(updateStats)
}

Meteor.methods({
  resetStats: function () {
    resetStats()
  },
  goToJail: function () {
    Eaters.update({}, {$set: {status: 'jail'}}, {multi:true})
  }
})

Accounts.validateLoginAttempt(function (info) {
  var screenName = info.user.services.twitter.screenName.toLowerCase()
  var eaters = Eaters.find({ 'auth.twitter': screenName }).fetch()
  if(eaters.length === 0) return false
  return true
})
