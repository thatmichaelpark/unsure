mockupApp.controller( 'JoblistCtrl', function ( $scope, $routeParams, $location, mockupFactory ) {

	$scope.getOrders = function () {
		$scope.data.currentOrder = null;
		$scope.data.currentOrderCopy = null;
		$scope.orders = $scope.ordersResource.query( { user: $scope.data.currentView }, function(){
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
	makeDisplayName = function ( c ) {
		var name = c.lastName + ', ' + c.firstName;
		if ( c.companyName ) {
			name += ' (' + c.companyName + ')';
		}
		return name;
	}
	
	$scope.getInventory = function () {
		$scope.inventory = $scope.inventoryResource.query();
	}
	$scope.getInventory();
	$scope.allUsers = ['Alan', 'Davis', 'Elden', 'Michael', 'Mustafa', 'Richard', 'Sam', 'Sergey', 'Tony', 'Techs', 'Front', 'All'];

	$scope.$on( 'userChanged', function ( e, u ) {
		$scope.data.currentView = u;
		$scope.getOrders();
	});
	
	$scope.viewChanged = function () {
		$scope.getOrders();
	}

	// use a timer to auto-refresh orders list
	// We only want one, so we kill the previous one.
	if ( angular.isDefined( mockupFactory.timerId ) ) {
		clearInterval( mockupFactory.timerId );
	}
	mockupFactory.timerId = setInterval( function () {
		if ( $scope.data.unchanged ) {
			$scope.getOrders();
		}
	}, 60000 );
	/* Previously (0.16), I had it so only the first timer stayed alive, and no new timers were
	allowed; unfortunately there was a problem. The first timer worked ok as long as you remained
	on the mockup.html page, but once you moved to joblist.html autorefresh stopped. Apparently
	the first timer's call to getOrders only updated mockup.html. Changing to use the latest
	timer calls the getOrders for joblist.html
	*/
	
	$scope.statuses = ['Intake', 'Checked in', 'In diags', 'Needs approval', 'Awaiting response',
	'Work approved', 'In progress', 'Needs attention', 
	'Part request',	'Part ordered', 'Part received',
	'Needs QA', 'Complete: call customer', 'Customer notified', 'Declined', 'Closed' ];

	$scope.data.unchanged = true;

	$scope.clickOrder = function( o ) {
		if ( $scope.data.unchanged ) {
			$scope.data.currentOrderNo = o.orderNo;
			$scope.getOrders();
		}	
	}
	
	$scope.orderClass = function ( order ) {
		var c = '';
		if ( order.orderNo === $scope.data.currentOrderNo ) {
			c = 'success ';
		}
		if ( order.assignedBy != $scope.currentUser ) {
			c += 'danger';
		}
		return c;
	}
	
	$scope.$on( '$routeChangeSuccess', function () {
		if ( $location.path().indexOf( '/joblist/' ) == 0 ) {
			$scope.data.currentOrderNo = Number( $routeParams.orderNo );
		}
		$scope.getOrders(); //hack
	});
});

mockupApp.controller( 'OrderCtrl', function ( $scope ) {

	$scope.data.showDetailsCheckbox = false;

	$scope.onSelectInventory = function ( $item, item ) {
		item.sku = $item.sku;
		item.desc = $item.desc;
		item.price = $item.price;
		item.taxable = $item.taxable;
		item.department = $item.department;
		item.qty = 1;
	}

	$scope.subtotal = function () {
		if ( $scope.data.currentOrderCopy ) {
			var t = 0;
			for ( var i=0; i<$scope.data.currentOrderCopy.bill.length; ++i ) {
				t += $scope.data.currentOrderCopy.bill[i].qty * $scope.data.currentOrderCopy.bill[i].price;
			}
			return t;
		}
	}
	$scope.tax = function () {
		if ( $scope.data.currentOrderCopy ) {
			var t = 0;
			for ( var i=0; i<$scope.data.currentOrderCopy.bill.length; ++i ) {
				if ( $scope.data.currentOrderCopy.bill[i].taxable ) {
					t += $scope.data.currentOrderCopy.bill[i].qty * $scope.data.currentOrderCopy.bill[i].price;
				}
			}
			$scope.data.currentOrderCopy.tax = Math.round( t * 9.5 ) / 100;
			return $scope.data.currentOrderCopy.tax;
		}
	}
	$scope.clickTender = function ( ) {
		$scope.data.unchanged = false;
		$scope.data.currentOrderCopy.tenders.push( { date: new Date(), method: '', amount: 0.00 } );
	}
	$scope.paymentMethods = [ 'Cash', 'Check', 'Credit card', 'Debit card', 'Gift certificate', 'Other' ];
	$scope.totalTender = function ( ) {
		if ( $scope.data.currentOrderCopy ) {
			var t = 0.0;
			for ( var i=0; i<$scope.data.currentOrderCopy.tenders.length; ++i ) {
				t += Number( $scope.data.currentOrderCopy.tenders[i].amount );
			}
			return t;
		}
	}
	
	$scope.clickOk = function ( ) {
		$scope.data.unchanged = true;
		if ( ($scope.data.currentOrder.status !== $scope.data.currentOrderCopy.status)
			|| ($scope.data.currentOrder.assignedTo !== $scope.data.currentOrderCopy.assignedTo) 
			|| ($scope.data.currentOrder.assignedBy !== $scope.data.currentOrderCopy.assignedBy) ) {
			$scope.data.currentOrderCopy.assignedBy = $scope.currentUser;
			$scope.data.currentOrderCopy.notes.push( { date: new Date(), by: $scope.currentUser, note:
				$scope.data.currentOrder.status + '/' + $scope.data.currentOrder.assignedTo + ' => ' +
				$scope.data.currentOrderCopy.status + '/' + $scope.data.currentOrderCopy.assignedTo } );
		}
		
		if ( $scope.data.currentOrderCopy.status == 'Closed' && !$scope.data.currentOrderCopy.closedDate ) {
			$scope.data.currentOrderCopy.closedDate = new Date();
		}
		
		var j = 0;
		var newBill = [];
		for ( var i=0; i<$scope.data.currentOrderCopy.bill.length; ++i ) {
			if ( Number($scope.data.currentOrderCopy.bill[i].qty) ) {
				newBill[ j++ ] = $scope.data.currentOrderCopy.bill[i];
			}
		}
		$scope.data.currentOrderCopy.bill = newBill;
		$scope.data.currentOrderCopy.modifiedDate = new Date();

		$scope.data.currentOrder = angular.copy( $scope.data.currentOrderCopy );
		new $scope.ordersResource( $scope.data.currentOrder ).$save()
		.then(
			function () { $scope.getOrders(); }
		).catch(
			function ( e ) { console.log(e); alert( 'wah-wah:' + e ); }
		);
		$scope.$broadcast('resetEdit');
	}
	$scope.clickCancel = function ( ) {
		$scope.data.currentOrderCopy = angular.copy( $scope.data.currentOrder );
		$scope.data.unchanged = true;
		$scope.$broadcast('resetEdit');
	}
	$scope.changeStatus = function () {
		$scope.data.currentOrder.assignedTo = $scope.currentUser;
		$scope.data.currentOrder.assignedBy = $scope.currentUser;
		$scope.data.unchanged = false;
	}
	$scope.changeAssignedTo = function () {
		$scope.data.currentOrder.assignedBy = $scope.currentUser;
		$scope.data.unchanged = false;
	}
	$scope.changeAssignedBy = function () {
		$scope.data.unchanged = false;
	}

	$scope.data.showStatusChangesCheckbox = false;

	$scope.showStatusChanges = function ( note ) {
		if ( angular.isDefined( note ) ) {
			return $scope.data.showStatusChangesCheckbox || note.indexOf( '=>' ) < 0;
		}
		return false;
	}
})

mockupApp.controller( 'SortableTableCtrl', function ( $scope, sortPredicateFactory ) {
	$scope.data = sortPredicateFactory.data;
	$scope.customSorter = function ( order ) {
		return order[ $scope.data.predicate ];
	}
});

mockupApp.filter('tel', function () {
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

mockupApp.directive('focus', function($timeout, $rootScope) {
	return {
		restrict: 'A',
		link: function($scope, $element, attrs) {
			$element[0].focus();
		}
	}
});

mockupApp.controller( 'editableParentCtrl', function ( $scope ) {
	$scope.added = false;
	$scope.clickAdd = function ( table, a ) {
		table.push( a );
		$scope.added = true;
		$scope.data.unchanged = false;
	}
	$scope.newDate = function ( ) { // hack because I couldn't get 'new Date()' to work
		return new Date();
	}
	$scope.$on( 'resetEdit', function ( ) {
		$scope.added = false;
	});
});

mockupApp.controller( 'editableCtrl', function ( $scope ) {
	$scope.edit = false;
	$scope.editing = function ( last ) {
		if ( $scope.added && last ) {
			$scope.edit = true;
		}
		return $scope.edit;
	}
	$scope.clickEdit = function ( ) {
		$scope.edit = !$scope.edit;
		$scope.data.unchanged = false;
	}
	$scope.$on( 'resetEdit', function ( ) {
		$scope.edit = false;
	});
});

mockupApp.controller( 'editableDeetParentCtrl', function ( $scope ) {
	$scope.added = false;
	$scope.clickAdd = function ( table, a ) {
		table.push( a );
		$scope.added = true;
		$scope.data.unchanged = false;
		$scope.data.showDetailsCheckbox = true;	// turn on deets display
	}
	$scope.newDate = function ( ) { // hack because I couldn't get 'new Date()' to work
		return new Date();
	}
	$scope.$on( 'resetEdit', function ( ) {
		$scope.added = false;
	});
});
