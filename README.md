Make Lunch!
===========

Each day, select who is in and the app will tell you who should cook.


homepage:
- Today's date
- Clickable images for each user
- Nominated cook

If I cook for 8 people (including me), I recieve 1 portion and give 8, so am +7

Meals are historical records.
Today is shared mutable.
User profiles are userd to determine who should cook

Who has the lowest (given - recieved). 
In the event of a tie, who cooked longest ago. (could also factor in meals eaten vs cooked)

Collections
===========

Record servings given vs received

Today
{
  date: isoDate
  cook: UserId
  people: [ { userId: userId, profile: Users.profile, eating: Boolean} ] 
  // all possible ordered by userProfile.lastEaten 
  // ...if you ate yesterday it's likely you'll eat today.
}

Meals
{
  date: isoDate
  cook: UserId
  eaters: [UserId]
}

Eaters
{
  name: String,
  img: url,
  servings: {
    given: Integer,
    received: Integer
  }
  lastCooked:  isoDate,
  lastEaten:   isoDate,
  mealsEaten:  Integer
  mealsCooked: Interger
}

