unsureApp.controller( 'JoblistCtrl', function ( $scope, $routeParams, $location, resourceFactory, orderService ) {

/*
	getUserOrders = function () {
		$scope.data.currentOrder = null;
		$scope.data.currentOrderCopy = null;
		$scope.orders = $scope.ordersResource.query( { user: $scope.orderServiceData.currentView }, function(){
			for (var i=0; i<$scope.orders.length; ++i) {	// compute order age
				var order = $scope.orders[i];
				order.age = (new Date() - new Date(order.modifiedDate)) / (24 * 60 * 60000); // days
			}
			$scope.incomingOrders = [];
			$scope.activeOrders = [];
			for ( var i=0; i<$scope.orders.length; ++i ) {
				if ( $scope.orders[i].assignedTo == $scope.orders[i].assignedBy && $scope.orders[i].assignedTo == $scope.currentUser ) {
					$scope.activeOrders.push( $scope.orders[i] );
				} else {
					$scope.incomingOrders.push( $scope.orders[i] );
				}
				(function () {
					var index = i;
					var c = new $scope.customersResource();
					c.$get( { custNo: $scope.orders[index].custNo } ).then( function () {
						$scope.orders[index].custName = makeDisplayName( c );
						$scope.orders[index].phone1 = c.phone1;
						$scope.orders[index].phone2 = c.phone2;
						if ( $scope.orders[index].orderNo === $scope.data.currentOrderNo ) {
							$scope.data.currentOrder = $scope.orders[index];
							$scope.data.currentOrderCopy = angular.copy( $scope.orders[index] );	// currentOrderCopy is a *copy* of an order. Edits are done on this copy.
						}
					});
				}());
			}

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
		});
	}
	getAllOrders = function () {
		$scope.data.currentOrder = null;
		$scope.data.currentOrderCopy = null;
		$scope.orders = $scope.ordersResource.query( { user: $scope.orderServiceData.currentView }, function(){
			for (var i=0; i<$scope.orders.length; ++i) {	// compute order age
				var order = $scope.orders[i];
				order.age = (new Date() - new Date(order.modifiedDate)) / (24 * 60 * 60000); // days
			}
			$scope.allOrders = [];
			for ( var i=0; i<$scope.orders.length; ++i ) {
				$scope.allOrders.push( $scope.orders[i] );
				(function () {
					var index = i;
					var c = new $scope.customersResource();
					c.$get( { custNo: $scope.orders[index].custNo } ).then( function () {
						$scope.orders[index].custName = makeDisplayName( c );
						$scope.orders[index].phone1 = c.phone1;
						$scope.orders[index].phone2 = c.phone2;
						if ( $scope.orders[index].orderNo === $scope.data.currentOrderNo ) {
							$scope.data.currentOrder = $scope.orders[index];
							$scope.data.currentOrderCopy = angular.copy( $scope.orders[index] );	// currentOrderCopy is a *copy* of an order. Edits are done on this copy.
						}
					});
				}());
			}

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
		});
	}
	var getTechOrders = function () {
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
	}
*/	
	$scope.getInventory = function () {
		$scope.inventory = $scope.inventoryResource.query();
	}
	$scope.getInventory();
	$scope.allUsers = ['Davis', 'Michael', 'Sam', 'Tony', 'Techs', 'Front', 'All'];

	
	$scope.statuses = ['Intake', 'Checked in', 'In diags', 'Needs approval', 'Awaiting response',
	'Work approved', 'In progress', 'Needs attention', 
	'Part request',	'Part ordered', 'Part received',
	'Needs QA', 'Complete: call customer', 'Customer notified', 'Declined', 'Closed' ];

	$scope.clickOrder = function( o ) {
		if ( orderService.data.unchanged ) {
			orderService.data.currentOrder = o;	// currentOrder "points to" order in list.
			orderService.getOrders();			// This reloads the list of orders so now the order that
												// currentOrder "points to" is disassociated from the
												// identical order in the list. Changes to currentOrder
												// won't be immediately reflected in the list.
												// In other words, currentOrder is a copy. Previously used
												// angular.copy(o) but then $get() didn't work.
			orderService.data.oldStatus = orderService.data.currentOrder.status;
			orderService.data.oldAssignedTo = orderService.data.currentOrder.assignedTo;
		}
	}
	
	$scope.orderClass = function ( order ) {
		var c = '';
		if ( orderService.data.currentOrder && (order.orderNo === orderService.data.currentOrder.orderNo) ) {
			c = 'selected ';
		}
		if ( order.assignedBy != orderService.data.currentUser ) {
			c += 'new';
		}
		return c;
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
	
	$scope.$on( '$routeChangeSuccess', function () {
		if ( $location.path().indexOf( '/joblist/' ) == 0 ) {
			$scope.data.currentOrderNo = Number( $routeParams.orderNo );
		}
		///$scope.getOrders(); //hack
	});
});


unsureApp.controller( 'SortableTableCtrl', function ( $scope, sortPredicateFactory ) {
	$scope.data = sortPredicateFactory.data;
	$scope.customSorter = function ( order ) {
		return order[ $scope.data.predicate ];
	}
});

unsureApp.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

		tel = tel.toString().trim();
		var newtel;
		newtel = tel.replace( /1(\d{3})(\d{3})(\d{4})\D*/, '1-$1-$2-$3' );
		if (tel !== newtel) return newtel;
		newtel = tel.replace( /(\d{3})(\d{3})(\d{4})\D*/, '$1-$2-$3' );
		if (tel !== newtel) return newtel;
		newtel = tel.replace( /(\d{3}) (\d{3})(\d{4})\D*/, '$1-$2-$3' );
		if (tel !== newtel) return newtel;
		newtel = tel.replace( /(\d{3}) (\d{3})-(\d{4})\D*/, '$1-$2-$3' );
		if (tel !== newtel) return newtel;
		return tel;
    };
});

// The next few things are for tables with Edit/Add buttons

unsureApp.directive('focus', function($timeout, $rootScope) {
	return {
		restrict: 'A',
		link: function($scope, $element, attrs) {
			$element[0].focus();
		}
	}
});

unsureApp.controller( 'editableParentCtrl', function ( $scope, orderService ) {
	$scope.added = false;
	$scope.clickAdd = function ( table, a ) {
		table.push( a );
		$scope.added = true;
		orderService.data.unchanged = false;
	}
	$scope.newDate = function ( ) { // hack because I couldn't get 'new Date()' to work
		return new Date();
	}
	$scope.$on( 'resetEdit', function ( ) {
		$scope.added = false;
	});
});

unsureApp.controller( 'editableCtrl', function ( $scope, orderService ) {
	$scope.edit = false;
	$scope.editing = function ( last ) {
		if ( $scope.added && last ) {
			$scope.edit = true;
		}
		return $scope.edit;
	}
	$scope.clickEdit = function ( ) {
		$scope.edit = !$scope.edit;
		orderService.data.unchanged = false;
	}
	$scope.$on( 'resetEdit', function ( ) {
		$scope.edit = false;
	});
});

unsureApp.controller( 'editableDeetParentCtrl', function ( $scope ) {
	$scope.added = false;
	$scope.clickAdd = function ( table, a ) {
		table.push( a );
		$scope.added = true;
		orderService.data.unchanged = false;
		$scope.data.showDetailsCheckbox = true;	// turn on deets display
	}
	$scope.newDate = function ( ) { // hack because I couldn't get 'new Date()' to work
		return new Date();
	}
	$scope.$on( 'resetEdit', function ( ) {
		$scope.added = false;
	});
});
