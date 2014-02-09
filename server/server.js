Meteor.startup(function () {
  Eaters.allow({
    insert: function (userId, doc) {
      if(!doc.servings){
        doc.servings = { given:0, received: 0 }
      }
    }
  })
   
  initToday();
});

/*
- get date
- get all users
*/
function initToday () {
  if(Today.find({date: todaysDate()}).count > 0 ) return;

  var today = {
    date: todaysDate(),
    cook: null,
    people: getPeople()
  }

  Today.insert(today)
}

// [{ userId: userId, profile: Users.profile, eating: Boolean}]
function getPeople () {
  var people = Eaters.find({}).fetch() // TODO: sort by last eaten
  people.forEach(function (p) { p.eating = false })
  // TODO: could set eating based on lastMeal date to optimise the number of clicks.
  return people
}

// returns todays date as 2014-02-09
function todaysDate() {
  return new Date().toISOString().split('T')[0]
}
