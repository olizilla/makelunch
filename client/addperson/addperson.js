Template.addperson.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var person = {
      name: tpl.find('.personName').value,
      img: tpl.find('.personImg').value
    }
    console.log(person)
    Eaters.create(person)
    showFeedback("Added " + person.name)
    tpl.find('form').reset()
  },

  'rendered': function (evt, tpl) {
    if (logins) console.log(logins)
  }
}