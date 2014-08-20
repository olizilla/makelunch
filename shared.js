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
  opts.auth = {twitter: opts.auth.twitter, email: opts.auth.email }
  console.log(opts)
  return Eaters.insert(opts)
}

Eaters.scoreSummary = function(eater){
  if(!eater) return null
  var score = eater.servings.given - eater.servings.received
  if (score === 0) return "perfect"
  if (score > 0) return "good"
  if (score < 0) return "bad"
}

// returns todays date as 2014-02-09
todaysDate = function todaysDate() {
  return new Date().toISOString().split('T')[0]
}