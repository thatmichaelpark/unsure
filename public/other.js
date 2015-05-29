 mockupApp.controller( 'OtherCtrl', function ( $scope, mockupFactory, $location ) {
 
 	var getOrders = function () {
		$scope.orders = $scope.ordersResource.query( { user: 'Techs' }, function(){
			$scope.ordersOnBench = [];
			for (var i=0; i<$scope.orders.length; ++i) {
				var order = $scope.orders[i];
				order.age = (new Date() - new Date(order.modifiedDate)) / (24 * 60 * 60000); // days
				$scope.ordersOnBench.push(order);
			}
		});
		$scope.orders2 = $scope.ordersResource.query( { user: 'Front' }, function(){
			$scope.ordersOther = [];
			for (var i=0; i<$scope.orders2.length; ++i) {
				var order = $scope.orders2[i];
				order.age = (new Date() - new Date(order.modifiedDate)) / (24 * 60 * 60000); // days
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
	$scope.urgencyClass = function (order) {
		if (order.age < 1) {
			return 'urgency0';
		} else if (order.age < 3) {
			return 'urgency1';
		} else if (order.age < 5) {
			return 'urgency2';
		} else if (order.age < 10) {
			return 'urgency3';
		}
		return 'urgency4';
	}
	

	getOrders();
 });
 