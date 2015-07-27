unsureApp.controller( 'OrderCtrl', function ( $scope, orderService ) {

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
		if ( orderService.data.currentOrder ) {
			var t = 0;
			for ( var i=0; i<orderService.data.currentOrder.bill.length; ++i ) {
				t += orderService.data.currentOrder.bill[i].qty * orderService.data.currentOrder.bill[i].price;
			}
			return t;
		}
	}
	$scope.tax = function () {
		if ( orderService.data.currentOrder ) {
			var t = 0;
			for ( var i=0; i<orderService.data.currentOrder.bill.length; ++i ) {
				if ( orderService.data.currentOrder.bill[i].taxable ) {
					t += orderService.data.currentOrder.bill[i].qty * orderService.data.currentOrder.bill[i].price;
				}
			}
			orderService.data.currentOrder.tax = Math.round( t * 9.5 ) / 100;
			return orderService.data.currentOrder.tax;
		}
	}
	$scope.clickTender = function ( ) {
		$scope.data.unchanged = false;
		orderService.data.currentOrder.tenders.push( { date: new Date(), method: '', amount: 0.00 } );
	}
	$scope.paymentMethods = [ 'Cash', 'Check', 'Credit card', 'Debit card', 'Gift certificate', 'Other' ];
	$scope.totalTender = function ( ) {
		if ( orderService.data.currentOrder ) {
			var t = 0.0;
			for ( var i=0; i<orderService.data.currentOrder.tenders.length; ++i ) {
				t += Number( orderService.data.currentOrder.tenders[i].amount );
			}
			return t;
		}
	}
	
	$scope.clickOk = function ( ) {
		orderService.data.unchanged = true;
		if ($scope.statusOrAssignedToChangedFlag) {
			$scope.statusOrAssignedToChangedFlag = false;
			orderService.data.currentOrder.assignedBy = orderService.data.currentUser;
			orderService.data.currentOrder.notes.push({
				date: new Date(),
				by: orderService.data.currentUser,
				note: orderService.data.oldStatus + '/' + orderService.data.oldAssignedTo + ' => ' +
					orderService.data.currentOrder.status + '/' + orderService.data.currentOrder.assignedTo
			});
		}
		if ( orderService.data.currentOrder.status == 'Closed' && !orderService.data.currentOrder.closedDate ) {
			orderService.data.currentOrder.closedDate = new Date();
		}
		
		var j = 0;
		var newBill = [];
		for ( var i=0; i<orderService.data.currentOrder.bill.length; ++i ) {
			if ( Number(orderService.data.currentOrder.bill[i].qty) ) {
				newBill[ j++ ] = orderService.data.currentOrder.bill[i];
			}
		}
		orderService.data.currentOrder.bill = newBill;
		orderService.data.currentOrder.modifiedDate = new Date();

		orderService.data.currentOrder.$save()
		.then(
			function () { orderService.getOrders(); }
		).catch(
			function ( e ) { 
				console.log('error:');
				console.log(e);
				alert( 'wah-wah:' + e + ' ' + orderService.data.currentOrder._id ); 
				orderService.data.currentOrder.$get();
			}
		);
		$scope.$broadcast('resetEdit');
	}
	$scope.clickCancel = function ( ) {
		orderService.data.currentOrder.$get()
		.then(
			function() {
///				console.log(orderService.data.currentOrder);;;
			}
		);
		orderService.data.unchanged = true;
		$scope.$broadcast('resetEdit');
	}
	$scope.statusOrAssignedToChangedFlag = false;
	
	$scope.statusOrAssignedToChanged = function () {
		$scope.statusOrAssignedToChangedFlag = true;
		orderService.data.unchanged = false;
	}

	$scope.data.showStatusChangesCheckbox = false;

	$scope.showStatusChanges = function ( note ) {
		if ( angular.isDefined( note ) ) {
			return $scope.data.showStatusChangesCheckbox || note.indexOf( '=>' ) < 0;
		}
		return false;
	}
})
