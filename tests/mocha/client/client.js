if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("Eaters.create", function(){
      
      //set up
      before(function(){
        Eaters.find().forEach(function(doc){
          Eaters.remove(doc._id)
        })
      })
       
      it("should create an Eater", function(){
        var testUser = {'name':'Oli','mealsCooked':18} 
        var testUserId = Eaters.create(testUser)
        var result = Eaters.findOne(testUserId)
        chai.expect( result.name ).to.equal( 'Oli' )
        Eaters.remove(testUserId)
      })
      
      it("should set default status 'jail'", function(){       
        var testUser = {'name':'Oli','mealsCooked':18}        
        var testUserId = Eaters.create(testUser)        
        var result = Eaters.findOne(testUserId)
        chai.expect( result.status ).to.equal( 'jail' )
        Eaters.remove(testUserId)
      })
      
      it("should respect status if exists", function(){
        var testUser = {'name':'Oli','mealsCooked':18, 'status':'rye'}
        var testUserId = Eaters.create(testUser)
        var result = Eaters.findOne(testUserId)
        chai.expect( result.status ).to.equal( 'rye' ) 
        Eaters.remove(testUserId)
      })
      
      it("should not add an Eater if Eater has no name", function(){
        chai.expect( Eaters.create.bind(this, {'name':null}) ).to.throw(Error)
        chai.expect( Eaters.create.bind(this, {'name':""}) ).to.throw(Error)
        chai.expect( Eaters.create.bind(this, {'name':" "}) ).to.throw(Error)
      })
      
      it("should not add an eater without a servings placeholder", function(){
        var testUser = {'name':'Fisher'}
        var testUserId = Eaters.create(testUser)
        var result = Eaters.findOne(testUserId)
        chai.expect( result.servings.given ).to.equal(0)
        Eaters.remove(testUserId)
      })
      //tear down
       
    })
    describe("Eaters.scoreSummary", function(){
      
      it('should return null if eaters is not defined', function(){
        var eater
        var result = Eaters.scoreSummary(eater)
        chai.expect( result ).to.equal( null )
      })
      it("should return 'perfect'", function(){
        var eater = {'servings': {'given' : 3,'received' : 3} }
        var result = Eaters.scoreSummary(eater)
        chai.expect( result ).to.equal( 'perfect' )
      })
      it("should return 'good'", function(){
        var eater = {'servings': {'given' : 6,'received' : 3} }
        var result = Eaters.scoreSummary(eater)
        chai.expect( result ).to.equal( 'good' )
      })
      it("should return 'bad'", function(){
        var eater = {'servings': {'given' : 1,'received' : 3} }
        var result = Eaters.scoreSummary(eater)
        chai.expect( result ).to.equal( 'bad' )
      })
    })

    describe("Testing Creation of Meals collection", function () {
      it('Meals.create should insert an object into the collection', function(){
        chai.expect(Meals.find().fetch().length).to.equal(0)
        var chefId = Eaters.create({name: 'Chef'})
        var eaterId = Eaters.create({name: 'Jill'})
        var meal = {
          dish: 'ham',
          date: '2014-08-21',
          chefs: [chefId],
          eaters: [eaterId]
        }
        Meals.create(meal)
        chai.expect(Meals.find().fetch().length).to.equal(1)
      })
      it('Meals.create should throw an error if dish is empty', function(){
        var chefId = Eaters.create({name: 'Chef'})
        var eaterId = Eaters.create({name: 'Jill'})
        var meal = {
          dish: '',
          date: '2014-08-21',
          chefs: [chefId],
          eaters: [eaterId]
        }
        chai.expect( function () {Meals.create(meal)} ).to.throw(Error)
      })
      it('Meals.create should throw error if badly formatted/invalid date is provided', function () {
        var chefId = Eaters.create({name: 'Chef'})
        var eaterId = Eaters.create({name: 'Jill'})
        var meal = {
          dish: 'big egg',
          date: '',
          chefs: [chefId],
          eaters: [eaterId]
        }
        chai.expect( function () {Meals.create(meal)} ).to.throw(Error)
      })
      it('Meals.create should throw error if no chefs or eaters', function () {
        var meal = {
          dish: 'big egg',
          date: '2014-11-17',
          chefs: [],
          eaters: []
        }
        chai.expect( function () {Meals.create(meal)} ).to.throw(Error)
      })
      it('Meals.create should throw error if eaters but no chef', function () {
        var eaterId = Eaters.create({name: 'Jill'})
        var meal = {
          dish: 'big egg',
          date: '2014-11-17',
          chefs: [],
          eaters: [eaterId]
        }
        chai.expect( function () {Meals.create(meal)} ).to.throw(Error)
      })
      it('Meals.create should throw error if chef but no eaters', function () {
        var chefId = Eaters.create({name: 'Chef'})
        var meal = {
          dish: 'big egg',
          date: '2014-11-17',
          chefs: [chefId],
          eaters: []
        }
        chai.expect( function () {Meals.create(meal)} ).to.throw(Error)
      })
    })
  });
}
