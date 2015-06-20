unsureApp.controller( 'OrderCtrl', function ( $scope ) {

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
