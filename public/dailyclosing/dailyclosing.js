 unsureApp.controller( 'DailyClosingCtrl', function ( $scope, resourceFactory, $location ) {

	var now = new Date();
	$scope.year = now.getFullYear();
	$scope.month = now.getMonth() + 1;
	$scope.date = now.getDate();
	
	$scope.acceptDate = function ( ) {
		today = new Date( $scope.year, $scope.month-1, $scope.date );
		tomorrow = new Date( $scope.year, $scope.month-1, $scope.date );
		tomorrow.setDate( today.getDate() + 1 );
		getOrders();
	}
	
	var getOrders = function ( ) {
		$scope.lastTime = new resourceFactory.ordersResource();
		$scope.lastTime.$getLastTime( null, null ).then( function () {
			$scope.ordersOpen =  resourceFactory.ordersResource.openbetween( { 
				from: today.getTime(), //new Date($scope.lastTime.date).getTime(),
				to: tomorrow.getTime()//now.getTime()
			}, function ( ) {
				analyzeOrders( $scope.ordersOpen );
				blahOrders( $scope.ordersOpen, today, tomorrow );;;
			});
			$scope.ordersCreated =  resourceFactory.ordersResource.createdbetween( { 
				from: today.getTime(), //new Date($scope.lastTime.date).getTime(),
				to: tomorrow.getTime()//now.getTime()
			}, function ( ) { analyzeOrders( $scope.ordersCreated ); });
			$scope.ordersClosed =  resourceFactory.ordersResource.closedbetween( { 
				from: today.getTime(), //new Date($scope.lastTime.date).getTime(),
				to: tomorrow.getTime()//now.getTime()
			}, function ( ) { analyzeOrders( $scope.ordersClosed ); });
		});
	}

	function blahOrders( orders, from, to ) {
		var checkins = [];
		var closedcheckins = [];
		var invoices = [];
		var otherdeposits = [];
		$scope.checkins = checkins;
		$scope.closedcheckins = closedcheckins;
		$scope.invoices = invoices;
		for( var i=0; i<orders.length; ++i ) {
			var o = orders[i];
			var createdDate = new Date(o.createdDate);
			if (from <= createdDate && createdDate < to) {
				if (o.status === 'Closed') {
					closedcheckins.push( o );
				} else {
					checkins.push( o );
				}
			}
			var closedDate = new Date(o.closedDate);
			if (from <= closedDate && closedDate < to) {
				invoices.push( o );
			}
			for( var j=0; j<o.tenders.length; ++j ) {
				var t = o.tenders[j];
				var d = new Date(t.date);
				if (from <= d && d < to) {
//					console.log( o.custName );
//					console.log( t );;;
				}
			}
		}
	}
	
	var analyzeOrders = function ( orders ) {
		orders.totals = {};
		orders.totals['Cash'] = 0;
		orders.totals['Check'] = 0;
		orders.totals['Credit card'] = 0;
		orders.totals['Debit card'] = 0;
		orders.totals['Gift certificate'] = 0;
		orders.totals['Other'] = 0;
		for( var i=0; i<orders.length; ++i ) {
			var o = orders[i];
			o['Cash'] = 0;
			o['Check'] = 0;
			o['Credit card'] = 0;
			o['Debit card'] = 0;
			o['Gift certificate'] = 0;
			o['Other'] = 0;
			for( var t=0; t<o.tenders.length; ++t ) {
				var tender = o.tenders[t];
				var m = tender.method;
				if ( m === '' ) m = 'Other';
				o[m] += Number(tender.amount);
				orders.totals[m] += Number(tender.amount);
			}
		}
	}
	
//	getLastTime();
/*	
	$scope.clickAdd = function ( ) {
		new resourceFactory.inventoryResource( $scope.item ).$add().then( getInventory );
	}
	$scope.clickClear = function ( ) {
		$scope.item = {};
	}
	$scope.clickUpdate = function ( ) {
		$scope.item.$save().then( getInventory );
	}
	$scope.clickItem = function ( item ) {
		$scope.item = item;
	}*/
});