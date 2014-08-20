Template.addperson.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var twitterHandle = tpl.find('.twitterHandle').value
    twitterHandle = twitterHandle.trim().toLowerCase().replace('@' , '')

    var person = {
      name: tpl.find('.personName').value,
      img: tpl.find('.personImg').value,
      auth: {
        twitter: twitterHandle,
        email: null
      }
    }
    console.log(person)
    Eaters.create(person)
    //showFeedback("Added " + person.name)
    tpl.find('form').reset()
  }
}