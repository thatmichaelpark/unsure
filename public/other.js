 mockupApp.controller( 'OtherCtrl', function ( $scope, mockupFactory, $location ) {
 
 	var getOrders = function () {
		$scope.orders = $scope.ordersResource.query( { user: 'Techs' }, function(){
			$scope.ordersOnBench = [];
			for (var i=0; i<$scope.orders.length; ++i) {
				var order = $scope.orders[i];
				$scope.ordersOnBench.push(order);
			}
		});
		$scope.orders2 = $scope.ordersResource.query( { user: 'Front' }, function(){
			$scope.ordersOther = [];
			for (var i=0; i<$scope.orders2.length; ++i) {
				var order = $scope.orders2[i];
				$scope.ordersOther.push(order);
			}
		});
	}
	makeDisplayName = function ( c ) {
		var name = c.lastName + ', ' + c.firstName;
		if ( c.companyName ) {
			name += ' (' + c.companyName + ')';
		}
		return name;
	}

	getOrders();
 });
 