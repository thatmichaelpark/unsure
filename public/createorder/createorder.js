mockupApp.controller( 'CreateOrderCtrl', function ( $scope, $http, $location ) {

	$scope.data = {};
	
    $scope.ok = function () {
		if ( !$scope.data.customer.custNo ) {
			// new customer: get new cust #, add cust to db, create new order
			$http.get("/customers/nextCustNo").success(function(custNo){
				$scope.data.customer.custNo = Number(custNo);
				$http.post('/customers/addcustomer/', $scope.data.customer );
				createNewOrder();
			});
		} else {
			// existing customer: just create new order
			createNewOrder();
		}
		
		function createNewOrder() {
			$http.get("/orders/nextOrderNo").success( function ( orderNo ){
				$scope.currentOrderNo = Number(orderNo);
				$scope.currentOrder = {};
				$scope.currentOrder.orderNo = Number(orderNo);
				$scope.currentOrder.custNo = $scope.data.customer.custNo;
				$scope.currentOrder.custName = makeDisplayName( $scope.data.customer );
				$scope.currentOrder.bill = [];
				$scope.currentOrder.tenders = [];
				$scope.currentOrder.notes = [ { date: new Date(), by: $scope.currentUser, note: $scope.data.note } ];
				$scope.currentOrder.internalNote = '';
				$scope.currentOrder.status = "Intake";
				$scope.currentOrder.assignedTo = $scope.currentUser;
				$scope.currentOrder.assignedBy = $scope.currentUser;
				new $scope.ordersResource( $scope.currentOrder ).$add().then(function(){
					$location.path( '/joblist/' + orderNo );
				});
			});
		}
    }
	
	$scope.clear = function () {
		$scope.data.customer = {};
    };
});

mockupApp.filter("nl2br", function($filter) {
 return function(data) {
   if (!data) return data;
   return data.replace(/\n\r?/g, '<br />');
 };
});

mockupApp.filter( 'blah', function ( $filter ) {
	return function ( data, name ) {
		// split name into names
		var re = /(\w+)/g;
		var names = [];
		var n;
		while ( n = re.exec( name ) ) {
			names.push( n[0] );
		}
		var result = data;
		for ( var i=0; i<names.length; ++i ) {
			result = $filter( 'filter' )( result, names[i] );
		}
		return result;
	}
});
mockupApp.controller( 'TypeaheadCtrl', 
	function TypeaheadCtrl($scope, $http) {
			
		getCustomers = function () {
			$http.get("/customers/all").success(function(data){
				$scope.customers = data;
			});
		};
		
		getCustomers();
		
		$scope.nameMaker = function( c ) {
			if ( angular.isDefined( c ) ) {
				var n = c.firstName + ' ' + c.lastName;
				if ( c.companyName ) {
					n += ' (' + c.companyName + ')';
				}
				return n;
			}
		}
		$scope.customer = [];
		$scope.onSelectPart = function ( item ) {
			$scope.data.customer = angular.copy( item );
		}
		$scope.blur = function () {
			var firstName = function(s) {
				var re = /(\w+)/g;
				var f = re.exec(s);
				if ( f ) {
					f = f[0];
					return f;
				}
			}
			var lastName = function(s) {
				var re = /(\w+)/g;
				re.exec(s)
				l = re.exec(s);
				if ( l ) {
					l = l[0];
					return l;
				}
			}
			if ( !angular.isObject( $scope.customerSelected ) ) {
				$scope.data.customer = [];
				$scope.data.customer.firstName = firstName($scope.customerSelected);
				$scope.data.customer.LastName = lastName($scope.customerSelected);
			}
		}
	}
);
