Template.editperson.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();
    var id = tpl.find('.personId').value
    var person = {
      name: tpl.find('.personName').value,
      img: tpl.find('.personImg').value,
      auth: {
        twitter: tpl.find('.twitterHandle').value.toLowerCase(),
        email: null
      }
    }

    Eaters.foo( id , person )

  }
}