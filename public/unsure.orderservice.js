unsureApp.factory( 'orderService', function ( $resource, resourceFactory ) {

	var data = {
		currentOrder: null,
		currentOrderNo: null,
		currentUser: null,
		currentView: null,
		jobslistView: 'joblist/userjobslist.html'
	};
	var orders;
	var ordersResource = resourceFactory.ordersResource;
	var customersResource = resourceFactory.customersResource;
	
	var getUserOrders = function () {
		data.currentOrder = null;
		orders = ordersResource.query( { user: data.currentView }, function(){
			for (var i=0; i<orders.length; ++i) {	// compute order age
				var order = orders[i];
				order.age = (new Date() - new Date(order.modifiedDate)) / (24 * 60 * 60000); // days
			}
			data.incomingOrders = [];
			data.activeOrders = [];
			for ( var i=0; i<orders.length; ++i ) {
				if ( orders[i].assignedTo == orders[i].assignedBy && orders[i].assignedTo == data.currentUser ) {
					data.activeOrders.push( orders[i] );
				} else {
					data.incomingOrders.push( orders[i] );
				}
				(function () {		// here we add some info from the corresponding customer record.
					var index = i;
					var c = new customersResource();
					c.$get( { custNo: orders[index].custNo } ).then( function () {
						orders[index].custName = makeDisplayName( c );
						orders[index].phone1 = c.phone1;
						orders[index].phone2 = c.phone2;
						if ( orders[index].orderNo === data.currentOrderNo ) {
							data.currentOrder = orders[index];
						}
					});
				}());
			}
/*
			if ( $scope.data.currentOrderNo ) {
				$scope.data.currentOrder = new $scope.ordersResource();
				$scope.data.currentOrder.$get( { orderNo: $scope.data.currentOrderNo } ).
				then( function () {
					if ( angular.isDefined( $scope.data.currentOrder.orderNo ) ) {
						var c = new $scope.customersResource();
						c.$get( { custNo: $scope.data.currentOrder.custNo } ).then( function () {
							$scope.data.currentOrder.custName = makeDisplayName( c );
							$scope.data.currentOrder.phone1 = c.phone1;
							$scope.data.currentOrder.phone2 = c.phone2;
							$scope.data.currentOrderCopy = angular.copy( $scope.data.currentOrder );	// currentOrderCopy is a *copy* of an order. Edits are done on this copy.
						});
					} else {
						$scope.data.currentOrderNo = null;
					}
				});
			}
*/			
		});
	}
	makeDisplayName = function ( c ) {
		var name = c.lastName + ', ' + c.firstName;
		if ( c.companyName ) {
			name += ' (' + c.companyName + ')';
		}
		return name;
	}

	userChanged = function () {
		data.currentView = data.currentUser;
		getUserOrders();
	};
/*
	changeView = function (v) {
		if (v === 'All') {
			$scope.list = "joblist/alljobslist.html"
			$scope.getOrders = getAllOrders;
		} else if (v === 'Techs') {
			$scope.list = "joblist/techjobslist.html"
			$scope.getOrders = getTechOrders;
		} else {
			$scope.list = "joblist/userjobslist.html"
			$scope.getOrders = getUserOrders;
		}
		$scope.getOrders();
	}

	changeView($scope.orderServiceData.currentView);
*/	
	viewChanged = function () {
//		changeView($scope.orderServiceData.currentView)
		getUserOrders();
	}
	
	return {
		data: data,
		userChanged: userChanged,
		viewChanged: viewChanged,
		getUserOrders: getUserOrders
	}
})
