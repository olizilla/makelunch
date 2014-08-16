Today = new Meteor.Collection('Today')

Meals = new Meteor.Collection('Meals')

Eaters = new Meteor.Collection('Eaters', { transform: function (e) {
  e.img = e.img || "http://www.gravatar.com/avatar/" + CryptoJS.MD5(e.name) + "?s=300&d=monsterid"
  return e
}})

// returns todays date as 2014-02-09
todaysDate = function todaysDate() {
  return new Date().toISOString().split('T')[0]
}