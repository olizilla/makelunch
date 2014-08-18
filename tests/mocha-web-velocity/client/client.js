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
      /*
      it('should throw an error if Eaters.servings.given is not defined', function(){
        chai.expect( Eaters.scoreSummary.bind(this, {} ) )to.throw(Error)
      })
      */
      /*
      it("should return 'perfect'", function(){
        var eater = {'servings': {'given' : 3,'recieved' : 3} }
        var result = Eaters.scoreSummary(eater)
        chai.expect( result.given ).to.equal(3)
      })
      
      it("should return 'good'", function(){
        var eater = {'servings': [ {'given' : 9}, {'recieved' : 3} ]}
        var result = Eaters.scoreSummary(eater)
        chai.expect( result.given ).to.equal(3)
      })
      
      it("should return 'bad'", function(){
        var eater = {'servings': [ {'given' : 3}, {'recieved' : 9} ]}
        var result = Eaters.scoreSummary(eater)
        chai.expect( result.given ).to.equal(3)
      })
       */
    })
  });
}
