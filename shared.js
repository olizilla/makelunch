Today = new Meteor.Collection('Today')

Meals = new Meteor.Collection('Meals')

Eaters = new Meteor.Collection('Eaters')

// returns todays date as 2014-02-09
todaysDate = function todaysDate() {
  return new Date().toISOString().split('T')[0]
}