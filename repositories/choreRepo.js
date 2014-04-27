exports.choreRepo = (function(){
	
	var mongo = require('mongodb'),
		_ = require('underscore');
	
	var databaseUrl = "test"; // "username:password@example.com/mydb"
	var collections = ["test" ];
	var db = require("mongojs").connect(databaseUrl, collections);
	
	var getPeople = function(gid){
		
		return [{name: 'Clare', choreList: []}, {name: 'Jon', choreList: []}];
	};

	var saveChores = function (chores){
		
		//var choreModel = mongoose.model('choreModel', getChoreSchema());
		//var chores = new choreModel(getChores());
		
		//chores.save();
		//console.log(choreModel.find({}));
		
		db.test.save(getChores(1), function(err, saved) {
			if( err || !saved ) console.log("User not saved");
		else console.log("Chores saved");
	});
		
	};
	
	var getChores = function(gid){ 
		
		return  {'gid':gid, 'chores':[
        {choreName:'Clean Bathroom', miseryIndex: 5},
        {choreName:'Vacuum', miseryIndex: 2},
        {choreName:'Shark', miseryIndex: 3},
        {choreName:'Clean Kitchen', miseryIndex: 2},
        {choreName:'Do Dishes', miseryIndex: 2},
        {choreName:'Laundry', miseryIndex: 4}
		]};
	};
	
	var calcIndices = function(chores){
        
		return _.map(chores, function(chore){return chore.miseryIndex;});
    };
   
    var shuffle = function(array) {
        
		var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };
  
    var calcAssignments = function(gid){
		
		var chores = getChores(gid);
        var people = getPeople(gid);
		var indices = calcIndices(chores.chores);

        var m = indices;
		var n = m.length;
        var S = [0, 0];
        var stones = [[], []];

        m.sort().reverse();
    
        for(var i = 0; i < n; i++){
            
			var A = (S[0] > S[1]) ? 1 : 0;
            S[A] += m[i];
            stones[A].push(m[i]);
        }
			
		var shuffled = shuffle(chores.chores);
				 
        var choreLists = [[],[]]
		
        for(var person = 0; person < people.length; person++){
            
			people[person].choreList =[];
            
            _.forEach( stones[person], function ( miseryIndex ) {
                
                var found = _.find( shuffled, function ( shuffledItem ) { return shuffledItem.miseryIndex == miseryIndex } );
                choreLists[person].push( found );
                shuffled = _.without(shuffled, found);
            } );
        }
           
        var shuffledChores = shuffle( choreLists );

        for ( var personIndex = 0; personIndex < people.length; personIndex++ ) {
            
			people[personIndex].choreList = shuffledChores[personIndex]; 
        }
		return people;
    }
	
	return{
	getChores:getChores,
	getPeople:getPeople,
	calcAssignments:calcAssignments,
	saveChores:saveChores}
})();