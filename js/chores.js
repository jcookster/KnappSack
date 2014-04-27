function choreCtrl($scope) {
  
    $scope.projectName = 'Chore Time';
    $scope.people = [{name: 'Clare', choreList: []}, {name: 'Jon', choreList: []}];
    
    $scope.chores = [
        { choreName: 'Erase Mirror', miseryIndex: 1 },
        {choreName:'Clean Bathroom', miseryIndex: 5},
        {choreName:'Vacuum', miseryIndex: 2},
        {choreName:'Shark', miseryIndex: 3},
        {choreName:'Clean Kitchen', miseryIndex: 2},
        {choreName:'Do Dishes', miseryIndex: 2},
        {choreName:'Laundry', miseryIndex: 4}
    ];

    $scope.addChore = function() {
        $scope.chores.push({choreName:$scope.choreName, miseryIndex:$scope.miseryIndex});
        $scope.choreName = '';
        $scope.miseryIndex = 0;
    };
  
    $scope.indices=[1];
  
    $scope.calcIndices = function(){
        $scope.indices = _.map($scope.chores, function(chore){return chore.miseryIndex;});
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
  
    $scope.calcAssignments = function(){
     
        $scope.calcIndices();
        var m = $scope.indices;
    
        var n = m.length;
        var S = [0, 0];
        var stones = [[], []];

        m.sort().reverse();
    
        for(var i = 0; i < n; i++){
            var A = (S[0] > S[1]) ? 1 : 0;
            S[A] += m[i];
            stones[A].push(m[i]);
        }
    
        var shuffled = shuffle($scope.chores);
        var choreLists = [[],[]]
    
        for(var person = 0; person<$scope.people.length; person++){
            $scope.people[person].choreList =[];
            debugger;
            _.forEach( stones[person], function ( miseryIndex ) {
                debugger;
                var found = _.find( shuffled, function ( shuffledItem ) { return shuffledItem.miseryIndex == miseryIndex } );
                choreLists[person].push( found );
                shuffled = _.without(shuffled, found);

            } );
        }
           
        var shuffledChores = shuffle( choreLists );

        for ( var personIndex = 0; personIndex < $scope.people.length; personIndex++ ) {
            $scope.people[personIndex].choreList = shuffledChores[personIndex];
        }
    }
}               

                