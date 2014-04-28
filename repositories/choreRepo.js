

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

    var getPeople = function ( res ) {

        db.people.find({ gid: currentUserGid() }, function ( error, item ) {
            if ( error )
                console.log( error );
            
            var people = _.each(item, function(current) {
                
                var person = new Knapp.person();
                person = _.defaults(current, person);
                
                return person;
            });

            console.log(people);

            res.send( people );
        });
    };

    var qGetPeople = function() {
        return q.people.find({ gid: currentUserGid() }).toArray().then(function(result) {
              
            var people = _.each(result, function(current) {
                var person = new Knapp.person();
                console.log(person);
                person = _.defaults(current, person);
                return person;
            });
            return people;
        });
    }

    var currentUserGid = function () {
        return 1;
    }

    var saveChores = function ( saveRequest ) {

        var chores = { gid: currentUserGid(), chores: saveRequest };

        console.log( chores );

        db.test.remove( { gid: currentUserGid() });

        db.test.save( chores, function ( err, saved ) {
            if ( err || !saved ) console.log( "User's Chores not saved" );
            else console.log( "Chores saved" );
        });

    };

    var qGetChores = function ( gid ) {
        
        console.log( 'attempting find of GID: ' + gid );

        return q.test.findOne({ "gid": 1 });
    };

    var getChores = function ( res ) {
        
        var gid = currentUserGid();

        console.log( 'attempting find of GID: ' + gid );

        db.test.findOne( { "gid": 1 }, function ( error, item ) {
            if ( error )
                console.log( error );
            if (item)
                res.send(item.chores);
            else
                res.send([]);
        });
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

        var gid = currentUserGid(),
            chorePromise = qGetChores(gid),
            peoplePromise = qGetPeople(gid);

        chorePromise.then(function(chores) {
            peoplePromise.then(function(people) {
                
                var aggregatedResult = performCalculation(chores, people);
                
                res.send(aggregatedResult);
            });
        });
    };

    var performCalculation = function(chores, people) {

        var indices = calcIndices(chores.chores);
        
        //var m = indices;
        var length = indices.length;
        var sums = [0, 0];
        var stones = [[], []];

        indices.sort().reverse();

        for (var i = 0; i < length; i++) {

            var chosenIndex = (sums[0] > sums[1]) ? 1 : 0;
            sums[chosenIndex] += indices[i];
            stones[chosenIndex].push(indices[i]);
        }
        
        var shuffled = shuffle(chores.chores);

        var choreLists = [[], []];

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
        saveChores: saveChores
    };
})();