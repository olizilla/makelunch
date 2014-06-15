Meteor.subscribe('eaters')

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

function addMealFormSelect2 () {
  $(".mealChef").select2({formatNoMatches: function () {return ""}})
  $(".mealEaters").select2({formatNoMatches: function () {return ""}})
}

function toggleAddMealMode () {
  $("body").toggleClass("adding-meal")

  $(".adding-meal .card").off("click")
  $(".adding-meal .card").on("click", function () {
    $(this).toggleClass("eating")
  })

  $(".adding-meal button.done").on("click", function () {
    doneChoosingEaters()
  })
}

function doneChoosingEaters () {
  $("body").addClass("adding-chefs")
  $(".adding-meal .card").off("click")
  $(".adding-meal .card").on("click", function () {
    $(this).toggleClass("chef")
  })

  $(".adding-meal.adding-chefs button.save").on("click", function () {
    insertMeal()
  })
}

function insertMeal() {
  var meal = {
    date: $('.mealDate').val(),
    chef: filterPeople("chef"),
    eaters: filterPeople("eating"),
    guests: parseInt($('.mealGuests').val(), 10),
    dish: $('.mealDish').val()
  }
  console.log(meal)
  Meals.insert(meal)
  showFeedback("Meal added")
  toggleAddMealMode()
}

function filterPeople (cssClass) {
  var people = []
  $("."+cssClass).each(function (i, el) {
    people.push($(el).attr("data-person-id"))
  })
  return people
}

function showFeedback (text) {
  var feedback = $("#feedback")
  feedback.show()
  feedback.text("> ");
  
  (function tickerText (i) {
    setTimeout(function() {
      feedback.text(feedback.text() + text[i])
      if (i < text.length - 1) {
        tickerText(++i)
      } else {
        feedback.delay(2000).fadeOut()
      }
    }, 50)
  })(0)
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

Template.home.rendered = function () {
  console.log("home")
  $(".add-meal").off("click")
  $(".add-meal").on("click", function (e) {
    e.preventDefault()
    console.log("adding a meal")
    toggleAddMealMode()
  })
}

Template.home.todaysDate = function () {
  return todaysDate()
}

Template.addmeal.rendered = function() {
  addMealFormSelect2()
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
    showFeedback("Added " + person.name)
    tpl.find('form').reset()
  }
}