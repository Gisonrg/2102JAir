angular.module('search', ['720kb.datepicker','ngCookies'])
	.controller('SearchCtrl', 
		function($scope, $cookieStore) {
			$scope.no_person = 1;
			$scope.trip_type = 'return';
			$scope.seat_class = 'Economy';
			$scope.submit = function() {


		        if (!$scope.from || !$scope.to) {
		          alert("Please fill in the airport name!");
		          return;
		        } 
		        if (!$scope.return && $scope.trip_type =='return') {
		        	alert("Please fill in the return date!");
		        	return;
		        }
		        if (!$scope.depart) {
		        	alert("Please fill in the depart date!");
		        	return;
		        }
		        // check finished
		        var form_data = {
		        	"from"   : $scope.from,
		        	"to"     : $scope.to,
		        	"depart" : $scope.depart,
		        	"return" : $scope.return,
		        	"no_person" : $scope.no_person,
		        	"trip_type" : $scope.trip_type,
		        	"seat_class": $scope.seat_class
		        };
		       	$cookieStore.put('searchResult',form_data);
		        window.location.replace("/result");
		}
	})


angular.module('result', ['720kb.datepicker','ngTable','ngCookies'])
	.controller('ResultCtrl', 
		function($scope, $cookieStore, ngTableParams, $http) {
			$scope.search_data;

			$scope.showSingle = false;
			$scope.showReturn = false;
			$scope.showBook = false;

			$scope.showEmpty;

			// search form data
			$scope.from;
			$scope.to;
			$scope.depart;
			$scope.return;
			$scope.no_person;
			$scope.trip_type;
			$scope.seat_class;

			// table data
			$scope.result = [{}];
			$scope.resultSingle = [{}];
			$scope.resultReturn = [{}];

			// first of all, decide if there is any search result.
			if ($cookieStore.get('searchResult')) {
				$scope.showSingle = true;

				search_data = $cookieStore.get('searchResult');
				$scope.from = search_data.from;
				$scope.to = search_data.to;
				$scope.depart = search_data.depart;
				$scope.return = search_data.return;
				$scope.no_person = search_data.no_person;
				$scope.trip_type =search_data.trip_type;
				$scope.seat_class = search_data.seat_class;

				$cookieStore.put('totalTickets',search_data.no_person);

				// there is searching result, go to API fetch data
				if (search_data.trip_type=='single') {
					$http.get('/api/search/'+search_data.from+"/"+search_data.to+"/"+search_data.no_person+"/"+search_data.depart+"/"+search_data.seat_class).
					// [[{},{}]]
					success(function(data) {
						$scope.result = data;
						// populate table
						$scope.resultSingle = $scope.result[0];
						// console.log("populate table"+JSON.stringify($scope.resultSingle));
						if ($scope.resultSingle.length != 0) {
							$scope.showBook = true;
						}
					    $scope.tableSingle = new ngTableParams({
					        page: 1,            // show first page
					        count: 50           // count per page
					    }, {
					    	counts: [], // hide page counts control
					        total: 1, // length of data
					        getData: function($defer, params) {
					            $defer.resolve($scope.resultSingle);
					        }
					    });
					});

				} else {
					// searchning for return flight
					$scope.showReturn = true;
					$http.get('/api/search/'+search_data.from+"/"+search_data.to+"/"+search_data.no_person+"/"+search_data.depart+"/"+search_data.return+"/"+search_data.seat_class).
					success(function(data) {
						$scope.result = data;
						// populate table
						$scope.resultSingle = $scope.result[0];
						$scope.resultReturn = $scope.result[1];
						if ($scope.resultSingle.length != 0 && $scope.resultReturn.length!=0) {
							$scope.showBook = true;
						}
						// console.log("populate table"+$scope.data);
					    $scope.tableSingle = new ngTableParams({
					        page: 1,            // show first page
					        count: 50           // count per page
					    }, {
					    	counts: [], // hide page counts control
					        total: 1, // length of data
					        getData: function($defer, params) {
					            $defer.resolve($scope.resultSingle);
					        }
					    });

					    $scope.tableReturn = new ngTableParams({
					        page: 1,            // show first page
					        count: 100           // count per page
					    }, {
					    	counts: [], // hide page counts control
					        total: 1, // length of data
					        getData: function($defer, params) {
					            $defer.resolve($scope.resultReturn);
					        }
					    });
					});
				}
				
				$cookieStore.remove('searchResult');
			}

			$scope.trip_type = 'return';
			$scope.seat_class = 'Economy';


			$scope.search = function() {
		        if (!$scope.from || !$scope.to) {
		          alert("Please fill in the airport name!");
		          return;
		        } 
		        if (!$scope.return && $scope.trip_type =='return') {
		        	alert("Please fill in the return date!");
		        	return;
		        }
		        if (!$scope.depart) {
		        	alert("Please fill in the depart date!");
		        	return;
		        }
		        // check finished
		        var form_data = {
		        	"from"   : $scope.from,
		        	"to"     : $scope.to,
		        	"depart" : $scope.depart,
		        	"return" : $scope.return,
		        	"no_person" : $scope.no_person,
		        	"trip_type" : $scope.trip_type,
		        	"seat_class": $scope.seat_class
		        };
		       	$cookieStore.put('searchResult',form_data);
		       	window.location.replace("/result");
			};

			$scope.bookNow = function() {
				var data = {"depart": $scope.resultSingle, 
					"return" : $scope.resultReturn, "class": search_data.seat_class};
				$http.post('/result', data).
				  success(function(feedback, status) {
				    if (status == 200) {
				    	window.location.replace("/checkout");
				    }	
				 });
			};
		}
);