angular.module('jair', ['720kb.datepicker'])
.controller('SearchCtrl', [
'$scope',
function($scope){
	$scope.trip_type = 'return';
	$scope.seat_class = 'Economy';

}]);