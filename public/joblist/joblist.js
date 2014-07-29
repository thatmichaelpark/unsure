mockupApp.controller( 'JoblistCtrl', function ( $scope, $routeParams, $location ) {
	$scope.data.currentOrderNo = null;

	$scope.getOrders = function () {
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
					});
				}());
				if ( $scope.orders[i].orderNo === $scope.data.currentOrderNo ) {
					$scope.data.currentOrder = $scope.orders[i];
					$scope.data.currentOrderCopy = angular.copy( $scope.orders[i] );	// currentOrderCopy is a *copy* of an order. Edits are done on this copy.
				}
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
	$scope.allUsers = ['Doug', 'Justin', 'Michael', 'Techs', 'Front', 'All'];

	$scope.getOrders();

	$scope.$on( 'userChanged', function ( e, u ) {
		$scope.data.currentView = u;
		$scope.getOrders();
	});
	
	$scope.viewChanged = function () {
		$scope.getOrders();
//		$timeout( function () {
//			$scope.data.currentView = $scope.currentUser;
//			$scope.getOrders();
//		}, 5000 );
	}
/**/
	setInterval( function () {
		if ( $scope.data.unchanged ) {
			$scope.getOrders();
		}
	}, 60000 );
/**/	
	
	$scope.assign = function () {
//		$scope.foind($scope.orders, 'orderid', $scope.data.currentOrderId).assignedBy = currentUser;
	}
	$scope.statuses = ['Intake', 'Checked in', 'In diags', 'Needs approval', 'Work approved', 'In progress', 'Yours!', 'Part request',
	'Part ordered', 'Part received', 'Service complete', 'Customer notified', 'Closed' ];

	$scope.data.unchanged = true;

	$scope.clickOrder = function( o ) {
		if ( $scope.data.unchanged ) {
			$scope.data.currentOrderNo = o.orderNo;
			$scope.getOrders();
		}	
	}
	$scope.$on( '$routeChangeSuccess', function () {
		if ( $location.path().indexOf( '/joblist/' ) == 0 ) {
			$scope.data.currentOrderNo = Number( $routeParams.orderNo );
			$scope.getOrders(); //hack
		}
	});
});

mockupApp.controller( 'OrderCtrl', function ( $scope ) {
	$scope.clickEditItem = function ( i ) {
		i.edit = true;
		$scope.data.unchanged = false;
	}
	$scope.clickAddItem = function () {
		$scope.data.currentOrderCopy.bill.push( { edit: true } );
		$scope.data.unchanged = false;
	}

	$scope.onSelectInventory = function ( $item, item ) {
		item.sku = $item.sku;
		item.desc = $item.desc;
		item.price = $item.price;
		item.qty = 1;
	}

	$scope.subtotal = function () {
		if ( angular.isDefined( $scope.data.currentOrderCopy ) && angular.isDefined( $scope.data.currentOrderCopy.bill ) ) {
			var t = 0;
			for ( var i=0; i<$scope.data.currentOrderCopy.bill.length; ++i ) {
				t += $scope.data.currentOrderCopy.bill[i].qty * $scope.data.currentOrderCopy.bill[i].price;
			}
			return t;
		}
	}
	$scope.tax = function () {
		if ( angular.isDefined( $scope.data.currentOrderCopy ) && angular.isDefined( $scope.data.currentOrderCopy.bill ) ) {
			var t = 0;
			for ( var i=0; i<$scope.data.currentOrderCopy.bill.length; ++i ) {
//				if ( $scoope.data.currentOrderCopy.bill[i].taxable ) {
					t += $scope.data.currentOrderCopy.bill[i].qty * $scope.data.currentOrderCopy.bill[i].price;
//				}
			}
			return t * 0.095;
		}
	}
	$scope.clickTender = function ( ) {
		$scope.data.unchanged = false;
		$scope.data.currentOrderCopy.tenders.push( { date: new Date(), method: '', amount: 0.00, edit: true, visible: true } );
	}
	$scope.paymentMethods = [ 'Cash', 'Check', 'Visa', 'MasterCard', 'Other CC', 'Gift Certificate' ];
	$scope.totalTender = function ( ) {
		if ( angular.isDefined( $scope.data.currentOrderCopy ) 
				&& angular.isDefined( $scope.data.currentOrderCopy.tenders ) ) {
			var t = 0.0;
			for ( var i=0; i<$scope.data.currentOrderCopy.tenders.length; ++i ) {
				t += Number( $scope.data.currentOrderCopy.tenders[i].amount );
			}
			return t;
		}
	}
	
	$scope.clickEditNote = function ( n ) {
		n.edit = true;
		$scope.data.unchanged = false;
	}
	$scope.clickAddNote = function () {
		$scope.data.currentOrderCopy.notes.push( { date: new Date(), by: $scope.currentUser, note: '', edit: true } );
		$scope.data.unchanged = false;
	}

	$scope.clickEditInternalNote = function ( ) {
		$scope.data.currentOrderCopy.internalNoteEdit = true;
		$scope.data.unchanged = false;
	}
	
	$scope.clickOk = function ( ) {
		$scope.data.unchanged = true;
		if( ($scope.data.currentOrder.status !== $scope.data.currentOrderCopy.status)
			|| ($scope.data.currentOrder.assignedTo !== $scope.data.currentOrderCopy.assignedTo) 
			|| ($scope.data.currentOrder.assignedBy !== $scope.data.currentOrderCopy.assignedBy) ) {
			$scope.data.currentOrderCopy.assignedBy = $scope.currentUser;
			$scope.data.currentOrderCopy.notes.push( { date: new Date(), by: $scope.currentUser, note:
				$scope.data.currentOrder.status + '/' + $scope.data.currentOrder.assignedTo + ' => ' +
				$scope.data.currentOrderCopy.status + '/' + $scope.data.currentOrderCopy.assignedTo } );
		}
		for ( var i=0; i<$scope.data.currentOrderCopy.notes.length; ++i ) {
			delete $scope.data.currentOrderCopy.notes[i].edit;
		}
		var j = 0;
		var newBill = [];
		for ( var i=0; i<$scope.data.currentOrderCopy.bill.length; ++i ) {
			delete $scope.data.currentOrderCopy.bill[i].edit;
			if ( Number($scope.data.currentOrderCopy.bill[i].qty) ) {
				console.log( $scope.data.currentOrderCopy.bill[i].qty );;;
				newBill[ j++ ] = $scope.data.currentOrderCopy.bill[i];
			}
		}
		$scope.data.currentOrderCopy.bill = newBill;
		
		for ( var i=0; i<$scope.data.currentOrderCopy.tenders.length; ++i ) {
			delete $scope.data.currentOrderCopy.tenders[i].edit;
			delete $scope.data.currentOrderCopy.tenders[i].visible;
		}
		delete $scope.data.currentOrderCopy.internalNoteEdit;
		$scope.data.currentOrder = angular.copy( $scope.data.currentOrderCopy );
		new $scope.ordersResource( $scope.data.currentOrder ).$save().then(
			function () { console.log('ok'); $scope.getOrders(); },
			function () { console.log('wah');;;alert( 'wah-wah' ); }
		);
	}
	$scope.clickCancel = function ( ) {
		$scope.data.currentOrderCopy = angular.copy( $scope.data.currentOrder );
		$scope.data.unchanged = true;
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

mockupApp.controller( 'SortableTableCtrl', function ( $scope ) {
	$scope.predicate = 'orderNo';
	$scope.customSorter = function ( order ) {
		return order[ $scope.predicate ];
	}
});
