Handlebars.registerHelper('humanDateFormat', function (isoDate) {
  return '> ' + isoDate
})

Template.today.meal = function () {
  return Today.findOne()
}

Template.today.whoIsChef = function () {
  var today = Today.findOne()
  
  var chef = today.people
    .filter(function(p){ return p.eating })
    .sort(function(a,b){
      if (score(a) === score(b)) return 0;
      if (score(a) > score(b)) return 1;
      return -1
    })

  return chef[0]
}

Template.deck.eater = function () {
  return Today.findOne().people
}

Template.deck.events = {
  'click .card': function (evt, tpl){
    this.eating = !this.eating

    var today = Today.findOne()

    today.people
      .filter(function(p){ return p._id === this._id}.bind(this))
      .forEach(function(p){ p.eating = !p.eating })

    Today.update(today._id, today)

    // Today.update(
    //   {'_id': today._id, 'people._id': this._id},
    //   { $set: {'awards.$.eating': !this.eating} }
    // )
  }
}

function score (person){
  if(!person || !person.servings) return 0;
  return person.servings.given - person.servings.received
}