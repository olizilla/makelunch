Template.editperson.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var twitterHandle = tpl.find('.twitterHandle').value
    twitterHandle = twitterHandle.trim().toLowerCase().replace('@' , '')

   var eaterId = this._id
   var person = {
      name: tpl.find('.personName').value,
      img: tpl.find('.personImg').value,
      auth: {
        twitter: twitterHandle,
        email: null
      }
    }

    Eaters.update(eaterId, {$set: person})
    MakeLunch.showFeedback('Updated ' + tpl.find('.personName').value)
  }
}