Today = new Meteor.Collection('Today')

Meals = new Meteor.Collection('Meals')

Eaters = new Meteor.Collection('Eaters', { transform: function (e) {
  e.img = e.img || "http://www.gravatar.com/avatar/" + CryptoJS.MD5(e.name) + "?s=300&d=monsterid"
  return e
}})

Eaters.create = function(opts){
  if(typeof opts.name != 'string' || opts.name === '' || opts.name.match(/^\s+$/)  ) throw new Error("name not string")
  opts.status = opts.status || 'jail'
  opts.servings = opts.servings || {'given':0,'received':0}
  return Eaters.insert(opts)
}

Eaters.scoreSummary = function(eater){
  if(!eater) return null
  var score = eater.servings.given - eater.servings.received
  if (score === 0) return "perfect"
  if (score > 0) return "good"
  if (score < 0) return "bad"
}

Meals.create = function(meal){
  if(!meal) throw new Error("No meal provided")
  if (meal.dish === '' || null) throw new Error("Can't create a meal with an empty dish!")
  if (meal.date === '' || null) throw new Error("Not valid date!")
  if (meal.chefs.length === 0) throw new Error("need chefs")
  if (meal.eaters.length === 0) throw new Error("need eaters") 
  return Meals.insert(meal)
}

// returns todays date as 2014-02-09
todaysDate = function todaysDate() {
  return new Date().toISOString().split('T')[0]
}