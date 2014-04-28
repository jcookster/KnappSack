function choreCtrl($scope, $http) {
  
    $scope.projectName = 'Chore Time';
    
	// TODO: Use a datacontext.
	$http({
		method: 'GET',
		url: '/api/v1/chores/gid/1'
		}).success(function(data, status, headers, config) {
			console.log('/chores succeeded. - ' + data.length);
			$scope.chores = data;
      		
		}).error(function(data, status, headers, config) {
			console.log( url + ' failed.');
		});
	
	// TODO: Use a datacontext.
	$http({
		method: 'GET',
		url: '/api/v1/people/gid/1'
		}).success(function(data, status, headers, config) {
			console.log('/people succeeded. - ' + data.length);
			$scope.people = data;
      		
		}).error(function(data, status, headers, config) {
			console.log( url + ' failed.');
		});
		
    $scope.addChore = function() {
        $scope.chores.push({choreName:$scope.choreName, miseryIndex:$scope.miseryIndex});
        $scope.choreName = '';
        $scope.miseryIndex = 0;
    };
	
	$scope.calcAssignments = function(){
		$http({
		method: 'GET',
		url: '/api/v1/assignments/gid/1'
		}).success(function(data, status, headers, config) {
			console.log('/assignments succeeded. - ' + data.length);
			$scope.people = data;
      		
		}).error(function(data, status, headers, config) {
			console.log( url + ' failed.');
		});
	};

    $scope.save = function() {
        $http({
		method: 'POST',
		url: '/api/v1/save',
        data: $scope.chores
		}).success(function(data, status, headers, config) {
			console.log('/assignments succeeded. - ' + data.length);
			$scope.people = data;
		}).error(function(data, status, headers, config) {
			console.log( url + ' failed.');
		});

    };
}               


                