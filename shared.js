Today = new Meteor.Collection('Today')

Meals = new Meteor.Collection('Meals')

Eaters = new Meteor.Collection('Eaters', { transform: function (e) {
  e.img = e.img || "http://www.gravatar.com/avatar/" + CryptoJS.MD5(e.name) + "?s=300&d=monsterid"
  return e
}})

Eaters.create = function(opts){
  if(typeof opts.name != 'string' || opts.name === '' || opts.name.match(/^\s+$/)  ) throw new Error("name not string")
  opts.status = opts.status || 'jail'
  return Eaters.insert(opts)
}

// returns todays date as 2014-02-09
todaysDate = function todaysDate() {
  return new Date().toISOString().split('T')[0]
}