Template.editmeal.events({
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
    Meals.create(meal)
    Router.go('meals')
  },

  'click .mealEaters .card': function (evt, tpl) {
    var card = $(evt.currentTarget)
    console.log(card.attr('class'))

    if (card.hasClass('chef')) card.removeClass('chef eating') 
      else if (card.hasClass('eating')) card.addClass('chef')
      else if (!card.hasClass('eating')) card.addClass('eating')
  }
})