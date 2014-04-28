

exports.choreRepo = ( function () {

    var Knapp = Knapp || {};

    Knapp.person = function(name) { this.name = name; };
    Knapp.person.prototype.name = "";
    Knapp.person.prototype.choreList = [];


    var databaseUrl = "test",
        collections = ["test", "people"],
        db = require( "mongojs" ).connect( databaseUrl, collections ),
        _ = require( 'underscore' ),
        pmongo = require('promised-mongo'),
        q = pmongo(databaseUrl, collections);

    var getPeople = function ( ) {
    
       return q.people.find({ gid: currentUserGid() }).toArray().then(function(result) {
              
            var people = _.each(result, function(current) {
                var person = new Knapp.person();
                console.log(person);
                person = _.defaults(current, person);
                return person;
            });
            return people;
        });
    };
    
    var currentUserGid = function () {
        return 1;
    }
    var save = function(request) {
        console.log('incoming request');
        console.log(request);
        saveChores(request.chores);
        savePeople(request.people);
    }

    var saveChores = function ( saveRequest ) {

        var chores = { gid: currentUserGid(), chores: saveRequest };
        
        db.test.remove( { gid: currentUserGid() });

        db.test.save( chores, function ( err, saved ) {
            if ( err || !saved ) console.log( "User's Chores not saved" );
            else console.log( "Chores saved" );
        });

    };

     var savePeople = function ( saveRequest ) {

         _.each(saveRequest, function(person) {
            // delete person._id;
             delete person.choreList;
             //delete person.gid;

             person.gid = currentUserGid();
         });
        
        db.people.remove( { gid: currentUserGid() });

        db.people.insert( saveRequest, function ( err, saved ) {
            if ( err || !saved ) console.log( "Users not saved" );
            else console.log( "Users saved" );
        });

    };

    var getChores = function ( ) {
        
       return q.test.findOne({ "gid": currentUserGid() });
    };

    var calcIndices = function ( chores ) {

        return _.map( chores, function ( chore ) { return parseInt(chore.miseryIndex); });
    };

    var shuffle = function ( array ) {

        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;

        // While there remain elements to shuffle...
        while ( 0 !== currentIndex ) {

            // Pick a remaining element...
            randomIndex = Math.floor( Math.random() * currentIndex );
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    var calcAssignments = function(res) {

        var chorePromise = getChores(),
            peoplePromise = getPeople();

        chorePromise.then(function(chores) {
            peoplePromise.then(function(people) {
                
                var aggregatedResult = performCalculation(chores, people);
                
                res.send(aggregatedResult);
            });
        });
    };
    var findSmallestIndex = function(array) {
        if (array) {

            var smallestIndex = 0,
                smallestValue = array[0];

            _.each(array, function(item, index) {

                if (item < smallestValue)
                    smallestIndex = index;
            });
        }
        return smallestIndex;
    };

    var initSumArray = function(people) {
        
        var sumArray = [];

        _.each(people, function() {
            sumArray.push(0);
        });

        return sumArray;
    };

    var initListArray = function(people) {
        var listArray = [];
        _.each(people, function() {
            listArray.push([]);
        });
        return listArray;
    };

    var performCalculation = function(chores, people) {

        var indices = calcIndices(chores.chores),
            length = indices.length,
            sums = initSumArray(people), //[0, 0, 0];
            shuffled = shuffle(chores.chores),
            choreLists = initListArray(people), //[[], [], []];
            stones = initListArray(people); //[[], [],[]];

        indices.sort().reverse();

        for (var i = 0; i < length; i++) {

            var chosenIndex = findSmallestIndex( sums );
            sums[chosenIndex] += indices[i];
            stones[chosenIndex].push(indices[i]);
        }
        
        for (var person = 0; person < people.length; person++) {

            people[person].choreList = [];

            _.forEach(stones[person], function(miseryIndex) {

                var found = _.find(shuffled, function(shuffledItem) { return shuffledItem.miseryIndex == miseryIndex });
                choreLists[person].push(found);
                shuffled = _.without(shuffled, found);
            });
        }

        var shuffledChores = shuffle(choreLists);

        for (var personIndex = 0; personIndex < people.length; personIndex++) {

            people[personIndex].choreList = shuffledChores[personIndex];
        }
        return people;
    };

    return {
        getChores: getChores,
        getPeople: getPeople,
        calcAssignments: calcAssignments,
        save: save
    };
})();