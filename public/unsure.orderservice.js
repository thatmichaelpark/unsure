unsureApp.factory( 'orderService', function ( $resource, resourceFactory ) {

	var data = {
		currentOrder: null,
		currentOrderNo: null,
		currentUser: null,
		currentView: null,
		jobslistView: null,
		unchanged: true
	};
	var orders;
	var ordersResource = resourceFactory.ordersResource;
	var customersResource = resourceFactory.customersResource;
	
	function getUserOrders() {
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
	function makeDisplayName(c) {
		var name = c.lastName + ', ' + c.firstName;
		if ( c.companyName ) {
			name += ' (' + c.companyName + ')';
		}
		return name;
	}

	var getOrdersVar;
	
	function getOrders() {
		getOrdersVar();
	}
	
	function viewChanged() {
		if (data.currentView === 'All') {
			data.jobslistView = "joblist/alljobslist.html"
			getOrdersVar = getAllOrders;
		} else if (data.currentView === 'Techs') {
			data.jobslistView = "joblist/techjobslist.html"
			getOrdersVar = getTechOrders;
		} else {
			data.jobslistView = "joblist/userjobslist.html"
			getOrdersVar = getUserOrders;
		}
		getOrders();
	}
	function userChanged() {
		data.currentView = data.currentUser;
		viewChanged();
	};

	// use a timer to auto-refresh orders list
	// We only want one, so we kill the previous one.
	if ( angular.isDefined( resourceFactory.timerId ) ) {
	alert("this can't be happening!");
		clearInterval( resourceFactory.timerId );
	}
	resourceFactory.timerId = setInterval( function () {
		if ( data.unchanged ) {
			getOrders();
		}
	}, 60000 );

	return {
		data: data,
		userChanged: userChanged,
		viewChanged: viewChanged,
		getOrders: getOrders
	}
})
