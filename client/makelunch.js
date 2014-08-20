MakeLunch = {} // our global for helpers

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
          people: Eaters.find({status:'jail'}),
        }
      }
    })

    this.route('editmeal', {
      path:'/editmeal/:_id',
      data: function () {
        return Meals.findOne({_id: this.params._id})

          //people: Eaters.find({status:'jail'}),
        
      }
    })

    this.route('editperson', { 
      path: '/editperson/:_id',
      data: function() {
        return Eaters.findOne(this.params._id)
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

    // Add route to body
    var routes = Router.routes.map(function(r){return r.name}).join(' ')
    Deps.autorun(function(){
      var $body = $('body')
      $body.removeClass(routes)
      var currentRoute = Router.current()
      if (currentRoute && currentRoute.route && currentRoute.route.name){
        $body.addClass(currentRoute.route.name)
      }
    })

  })// end router.map
  
  //registerHelpers
  UI.registerHelper('scoreSummary', Eaters.scoreSummary)
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

MakeLunch.showFeedback = function showFeedback (text) {
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
  'dblclick .card': function(evt, tpl){
    var newStatus = (this.status !== 'rye') ? 'rye' : 'jail'
    Eaters.update(this._id, { $set: {status: newStatus}})
  }
})
