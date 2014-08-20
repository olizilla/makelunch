EatingToday = new Meteor.Collection()

Template.addmeal.events({
  'submit': function (evt, tpl) {
    evt.preventDefault()

    var meal = {
      date: tpl.find('.mealDate').value,
      chef: $('.chef').map(function(i, dom) { return $(dom).data('eater')}).get(),
      eaters: $('.eating').map(function(i, dom) { return $(dom).data('eater')}).get(),
      guests: parseInt(tpl.find('.mealGuests').value, 10),
      dish: tpl.find('.mealDish').value
    }

    console.log(meal)
    Meals.insert(meal)
    Router.go('meals')
  },
  'click .chefs .card': function(evt, tpl) {
    var card = $(evt.currentTarget)
    card.toggleClass('chef')
  },
  'click .mealEaters .card': function (evt, tpl) {
    var card = $(evt.currentTarget)
    if (card.hasClass('eating')) {
      EatingToday.remove(this._id)
    } else {
      EatingToday.insert(this)
    }
    card.toggleClass('eating')
  }
})

Template.addmeal.chefs = function () {
  return EatingToday.find()
}

Template.addmeal.rendered = function () {
  EatingToday.remove()
}