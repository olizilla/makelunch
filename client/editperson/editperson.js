Template.editperson.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var id = tpl.find('.personId').value
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

    Eaters.foo(id, person)

  }
}