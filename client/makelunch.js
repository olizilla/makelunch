Meteor.subscribe('eaters')

Meteor.startup(function () {

  Router.map(function () {
    
    this.route('home', { 
      path:'/' ,
      data: function () {
        return {
          people: Eaters.find({}),
          date: todaysDate(),
          whoShouldCook: whoShouldCook()
        }
      }
    })
    
    this.route('addmeal', { 
      path:'/addmeal',
      data: function () {
        return {
          people: Eaters.find({})
        }
      }
    })

    this.route('addperson')

    this.route('meals', {
      path:'/meals',
      before: [
        function () {
          this.subscribe('meals')
        }
      ],
      data: function () {
        return {
          meals: Meals.find({}, {sort: {date: -1}}).fetch()
        }
      }
    })

  })// end router.map

})// end Meteor.startup

Handlebars.registerHelper('fromNow', function (date) {
  return moment(date, 'YYYY-MM-DD').fromNow()
})

Handlebars.registerHelper('profile', function (userId) {
  return Eaters.findOne(userId)
})

function whoShouldCook() {
  var eaters = Eaters.find().fetch()
  
  eaters.sort(function (a,b) {
    if (score(a) === score(b)) return 0;
    if (score(a) > score(b)) return 1;
    return -1
  })

  return eaters[0]
}

function score (person){
  if(!person || !person.servings) return 0;
  return person.servings.given - person.servings.received
}

Template.addmeal.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var meal = {
      date: tpl.find('.mealDate').value,
      chef: $(tpl.find('.mealChef')).val(),
      eaters: $(tpl.find('.mealEaters')).val(),
      guests: parseInt(tpl.find('.mealGuests').value, 10),
      dish: tpl.find('.mealDish').value
    }
    console.log(meal)
    Meals.insert(meal)
    tpl.find('form').reset()
  }
}

Template.addperson.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var person = {
      name: tpl.find('.personName').value,
      img: tpl.find('.personImg').value
    }
    console.log(person)
    Eaters.insert(person)
    tpl.find('form').reset()
  }
}
