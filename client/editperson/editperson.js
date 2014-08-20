Template.addperson.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var person = {
      name: tpl.find('.personName').value,
      img: tpl.find('.personImg').value,
      auth: {
        twitter: tpl.find('.twitterHandle').value.toLowerCase(),
        email: null
      }
    }
    console.log(person)
    Eaters.create(person)
    //showFeedback("Added " + person.name)
    tpl.find('form').reset()
  }
}