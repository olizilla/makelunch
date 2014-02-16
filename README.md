Make Lunch!
===========

Each day, select who is in and the app will tell you who should cook.

If I cook for 8 people (including me), I recieve 1 portion and give 8, so am +7

Meals are historical records.
The stats on the Eaters are calculated on meal insert.

Who has the lowest (given - recieved). 
In the event of a tie, who cooked longest ago. (could also factor in meals eaten vs cooked)

Collections
-----------

Meals
{
  date: isoDate
  chef: UserId
  eaters: [UserId]
  guests: Number
  dish: String
}

Eaters
{
  name: String,
  img: url,
  servings: {
    given: Integer,
    received: Integer
  }
  mealsCooked: Interger,
  lastCooked:  isoDate,
  lastEaten:   isoDate
}

Initial data
------------

- 2014-02-10, Hammick cooked leaky pasta for Elliot, Evans, Robinson, Wooding + 1 guest

- 2014-02-11, Wooding cooked baked potatoes for Elliot, Evans, Hammick, Shaw + 1 guest

- 2014-02-12, Shaw Bacon pasta cooked for Elliot, Hammick, Robinson, Wooding + 1 guest

- 2014-02-13, Evans cooked Onion, Bean & Pancetta Stew for Shaw, Wooding, Elliot, Hammick, Heatherington + 1 guest

- 2014-02-14, Elliot and Heatherington cooked Fish pie for Shaw, Wooding, Elliot, Hammick, Evans, Robinson


Notes
-----

/ = stats & recommendations
/addMeal = modify the meal datas
/addEater = modify the people

1. Allow entry of meals for a given date
2. Recomend who should cook next...

1. Add meal 
{
  date: 2014-02-10
  eaters: [userId]
  chef: [userId]
  dish: String
  guests: Integer
}

on meal insert, 
- for each eater increment servings.recieved by 1 and last eaten date.
- for each chef increment servings.given by eaters.length and increment mealsCooked and lastCookedDate

