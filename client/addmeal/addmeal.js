Template.addmeal.rendered = function() {
  addMealFormSelect2()
}

function addMealFormSelect2 () {
  $(".mealChef").select2({formatNoMatches: function () {return ""}})
  $(".mealEaters").select2({formatNoMatches: function () {return ""}})
}