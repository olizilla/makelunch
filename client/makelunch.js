Meteor.subscribe('eaters', function () {
  // $(".mealChef").on("load", function (e) {
  //   console.log(e)
    $(".mealChef").select2()
    $(".mealEaters").select2()
//  })    
})

Meteor.startup(function () {

  Router.map(function () {
    
    this.route('home', { 
      path:'/' ,
      data: function () {
        return {
          people: Eaters.find({}).fetch()
            .map(function (e) {
              e.img = e.img || "http://www.gravatar.com/avatar/" + CryptoJS.MD5(e.name) + "?s=300&d=monsterid"
              return e
            })
            .sort(scoreSort),
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
  return moment(date + 'T12:00').fromNow()
})

Handlebars.registerHelper('profile', function (userId) {
  var eater = Eaters.findOne(userId)
  eater.img = eater.img || "http://www.gravatar.com/avatar/" + CryptoJS.MD5(eater.name) + "?s=300&d=monsterid"
  return eater
})

function scoreSort (a, b) {
  if (score(a) === score(b)) {
    var aLastCooked = a.lastCooked || "1970-01-01"
    var bLastCooked = b.lastCooked || "1970-01-01"

    if (moment(aLastCooked).isSame(bLastCooked)) {
      return 0
    } else if (moment(aLastCooked).isBefore(bLastCooked)) {
      return -1
    } else {
      return 1
    }
  }
  if (score(a) > score(b)) return 1;
  return -1
}

function whoShouldCook() {
  var eaters = Eaters.find().fetch()
  
  eaters.sort(scoreSort)

  return eaters[0]
}

function score (person){
  if(!person || !person.servings) return 0;
  return person.servings.given - person.servings.received
}

function resetForm (tpl) {
  tpl.find('form').reset()
  $(".mealChef").select2("val", "")
  $(".mealEaters").select2("val", "")
}

Template.addmeal.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var meal = {
      date: tpl.find('.mealDate').value,
      chef: $('.mealChef').select2("val"),
      eaters: $('.mealEaters').select2("val"),
      guests: parseInt(tpl.find('.mealGuests').value, 10),
      dish: tpl.find('.mealDish').value
    }
    console.log(meal)
    Meals.insert(meal)
    resetForm(tpl)
  }
}

Template.addmeal.todaysDate = function () {
  return todaysDate()
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