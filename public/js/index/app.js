angular.module('search', ['720kb.datepicker','ngCookies','siyfion.sfTypeahead'])
	.controller('SearchCtrl', 
		function($scope, $cookieStore) {
			$scope.depart = "2014-11-13";
			$scope.return = "2014-11-14";
			$scope.no_person = 1;
			$scope.trip_type = 'return';
			$scope.seat_class = 'Economy';

			/*******
			Configure typeahead.js
			*******/
			// Instantiate the bloodhound suggestion engine
			  var airports = new Bloodhound({
			    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.city); },
			    queryTokenizer: Bloodhound.tokenizers.whitespace,
			    local: [
				    {
				        "code": "BKK",
				        "name": "Bangkok International Airport",
				        "city": "Bangkok",
				        "country": "Thailand"
				    },
				    {
				        "code": "CAI",
				        "name": "Cairo International",
				        "city": "Cairo",
				        "country": "Egypt"
				    },
				    {
				        "code": "CAN",
				        "name": "Guangzhou Baiyun International Airport",
				        "city": "Guangzhou",
				        "country": "China"
				    },
				    {
				        "code": "CDG",
				        "name": "Charles de Gaulle Airport",
				        "city": "Paris",
				        "country": "France"
				    },
				    {
				        "code": "CSX",
				        "name": "Changsha Huang Hua International Airport",
				        "city": "Changsha",
				        "country": "China"
				    },
				    {
				        "code": "DEL",
				        "name": "Indira Gandhi International Airport",
				        "city": "Delhi",
				        "country": "India"
				    },
				    {
				        "code": "DME",
				        "name": "Moscow Domodedovo Airport",
				        "city": "Moscow",
				        "country": "Russia"
				    },
				    {
				        "code": "DXB",
				        "name": "Dubai International Airport",
				        "city": "Dubai",
				        "country": "United Arab Emirates"
				    },
				    {
				        "code": "GRU",
				        "name": "São Paulo-Guarulhos International Airport",
				        "city": "Saint Paul",
				        "country": "Brazil"
				    },
				    {
				        "code": "HKG",
				        "name": "Hong Kong International Airport",
				        "city": "Hong Kong",
				        "country": "Hong Kong"
				    },
				    {
				        "code": "JFK",
				        "name": "John F Kennedy International Airport",
				        "city": "New York",
				        "country": "United States"
				    },
				    {
				        "code": "KUL",
				        "name": "Kuala Lumpur International Airport",
				        "city": "Kuala Lumpur",
				        "country": "Malaysia"
				    },
				    {
				        "code": "LAX",
				        "name": "Los Angeles International Airport",
				        "city": "Los Angeles",
				        "country": "United States"
				    },
				    {
				        "code": "LHR",
				        "name": "London Heathrow Airport",
				        "city": "London",
				        "country": "United Kingdom"
				    },
				    {
				        "code": "NRT",
				        "name": "Narita International",
				        "city": "Tokyo",
				        "country": "Japan"
				    },
				    {
				        "code": "PEK",
				        "name": "Beijing Capital International Airport",
				        "city": "Beijing",
				        "country": "China"
				    },
				    {
				        "code": "SFO",
				        "name": "San Francisco International",
				        "city": "San Francisco",
				        "country": "United States"
				    },
				    {
				        "code": "SIN",
				        "name": "Singapore Changi International",
				        "city": "Singapore",
				        "country": "Singapore"
				    },
				    {
				        "code": "SYD",
				        "name": "Sydney Kingsford Smith International",
				        "city": "Sydney",
				        "country": "Australia"
				    },
				    {
				        "code": "XIY",
				        "name": "Xi'an Xianyang International Airport",
				        "city": "Xi'an",
				        "country": "China"
				    }]
			  });

			  // initialize the bloodhound suggestion engine
			  airports.initialize();

			  // Typeahead options object
			  $scope.exampleOptions = {
			    highlight: true
			  };

			  // Single dataset example
			  $scope.exampleData = {
			    displayKey: 'code',
			    source: airports.ttAdapter(),
			    templates: {
			        suggestion: function (airport) {
			            return '<p>' + airport.city + "-"+ airport.code + '</p>';
			        }
			    }
			  };

			$scope.submit = function() {
				var depart_date = new Date($scope.depart);
				var return_date = new Date($scope.return);
				var day_diff = return_date - depart_date;
		        if (!$scope.from || !$scope.to) {
		          alert("Please fill in the airport name!");
		          return;
		        } 

		        if ($scope.trip_type =='return' ) {
		        	if (day_diff < 0) {
						alert("Depart date cannot be later than return date!");
						return;
					}
					if (!$scope.return ) {
						alert("Please fill in the correct return date!");
		        		return;
					}
		        }

		        if (!$scope.depart) {
		        	alert("Please fill in the depart date!");
		        	return;
		        }
		        
		        // check finished
		        var form_data = {
		        	"from"   : $scope.from.code,
		        	"to"     : $scope.to.code,
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
		        var depart_date = new Date($scope.depart);
				var return_date = new Date($scope.return);
				var day_diff = return_date - depart_date;
		        if (!$scope.from || !$scope.to) {
		          alert("Please fill in the airport name!");
		          return;
		        } 

		        if ($scope.trip_type =='return' ) {
		        	if (day_diff < 0) {
						alert("Depart date cannot be later than return date!");
						return;
					}
					if (!$scope.return ) {
						alert("Please fill in the correct return date!");
		        		return;
					}
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