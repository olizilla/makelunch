Meteor.subscribe('eaters')

Meteor.startup(function () {

  Router.map(function () {

    this.route('home', {
      path:'/' ,
      data: function () {
        return {
          eaters: Eaters.find({status:'jail'}).fetch().sort(scoreSort),
          mia: Eaters.find({status:'rye'}).fetch(),
          date: todaysDate(),
          whoShouldCook: whoShouldCook()
        }
      }
    })

    this.route('addmeal', {
      path:'/addmeal',
      data: function () {
        return {
          people: Eaters.find({status:'jail'})
        }
      }
    })

    this.route('addperson')

    this.route('meals', {
      path:'/meals',
      onBeforeAction: [
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

UI.registerHelper('fromNow', function (date) {
  return moment(date + 'T12:00').fromNow()
})

UI.registerHelper('profile', function (userId) {
  var eater = Eaters.findOne(userId)
  eater.img = eater.img || "http://www.gravatar.com/avatar/" + CryptoJS.MD5(eater.name) + "?s=300&d=monsterid"
  return eater
})

UI.registerHelper('score', function (eater) {
  return eater.servings.given - eater.servings.received
})

UI.registerHelper('scoreSummary', function (eater) {
  var score = eater.servings.given - eater.servings.received
  if (score === 0) return "perfect"
  if (score > 0) return "good"
  if (score < 0) return "bad"
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

function resetHomepage () {
  $("body").removeClass()
  $(".deck .card").removeClass("eating chef")
  $("input").val("")
}

function enterAddMealMode () {
  console.log("> Enter add meal mode")
  $("body").addClass("adding-meal adding-eaters")

  $(".adding-meal .card").off("click")
  $(".adding-meal .card").on("click", function () {
    $(this).toggleClass("eating")
  })

  $(".adding-meal button.next").off()
  $(".adding-meal button.next").on("click", function () {
    doneChoosingEaters()
  })
}

function doneChoosingEaters () {
  console.log("> Enter add chef mode")
  $("body").removeClass("adding-eaters").addClass("adding-chefs")
  $(".adding-meal .card").off("click")
  $(".adding-meal .card").on("click", function () {
    $(this).toggleClass("chef")
  })

  $(".adding-meal.adding-chefs button.next").off()
  $(".adding-meal.adding-chefs button.next").on("click", function () {
    doneChoosingChef()
  })
}

function doneChoosingChef () {
  $("body").removeClass("adding-chefs").addClass("adding-meal-details")
  $(".adding-meal-details button.save").on("click", function () {
    doneDescribingMeal()
  })
}

function doneDescribingMeal () {
  insertMeal()
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
  resetHomepage()
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

Template.home.todaysDate = function () {
  return todaysDate()
}

Template.card.events({
  'click': function(evt, tpl){

    var $this = $(tpl.firstNode)
    var data = this

    $this.pep({
      constrainTo: 'window',
      droppable: '.drop',
      revert: true,
      revertIf: function(ev, obj){
        return !this.activeDropRegions.length
      },
      stop: function(ev, obj){
        if (obj.activeDropRegions.length > 0) {
          if (obj.activeDropRegions[0].hasClass('rye')){
//            console.log('rye', data)
            Eaters.update(data._id, { $set: {status: 'rye'}})
          }
          if (obj.activeDropRegions[0].hasClass('deck')){
//            console.log('deck', data)
            Eaters.update(data._id, { $set: {status: 'jail'}})
          }
        }
      }
    } )
  }
})
