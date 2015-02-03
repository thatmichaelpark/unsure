 mockupApp.controller( 'DailyClosingCtrl', function ( $scope, mockupFactory, $location ) {

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
		$scope.lastTime = new mockupFactory.ordersResource();
		$scope.lastTime.$getLastTime( null, null ).then( function () {
			$scope.ordersOpen =  mockupFactory.ordersResource.openbetween( { 
				from: today.getTime(), //new Date($scope.lastTime.date).getTime(),
				to: tomorrow.getTime()//now.getTime()
			}, function ( ) { analyzeOrders( $scope.ordersOpen );});
			$scope.ordersCreated =  mockupFactory.ordersResource.createdbetween( { 
				from: today.getTime(), //new Date($scope.lastTime.date).getTime(),
				to: tomorrow.getTime()//now.getTime()
			}, function ( ) { analyzeOrders( $scope.ordersCreated ); });
			$scope.ordersClosed =  mockupFactory.ordersResource.closedbetween( { 
				from: today.getTime(), //new Date($scope.lastTime.date).getTime(),
				to: tomorrow.getTime()//now.getTime()
			}, function ( ) { analyzeOrders( $scope.ordersClosed ); });
		});
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
			console.log(i + " " + orders.length + ' ' + o.custName + " " + o.tenders.length);;;
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
		new mockupFactory.inventoryResource( $scope.item ).$add().then( getInventory );
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