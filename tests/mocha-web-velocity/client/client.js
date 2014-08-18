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
      
      //tear down
       
    });
  });
}
