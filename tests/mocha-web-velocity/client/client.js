if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("a group of tests", function(){
      
      //set up
      before(function(){
        Eaters.find().forEach(function(doc){
          Eaters.remove(doc._id)
        })
      })
       
      it("should find 1 mongo object", function(){
        console.log('Eaters: '+Eaters.find().count())
        chai.expect( Eaters.find().count() ).to.equal(0)
        
        var testUser = {'name':'Oli','mealsCooked':18}
        
        var testUserId = Eaters.insert(testUser)
        
        chai.expect( Eaters.find().count() ).to.equal(1)
        
        Eaters.remove(testUserId)

      })
      
      //tear down
       
    });
  });
}
