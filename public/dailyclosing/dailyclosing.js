 mockupApp.controller( 'DailyClosingCtrl', function ( $scope, mockupFactory, $location ) {

	var now = new Date();
	$scope.year = now.getFullYear();
	$scope.month = now.getMonth() + 1;
	$scope.date = now.getDate();
	
	$scope.acceptDate = function ( ) {
		today = new Date( $scope.year, $scope.month-1, $scope.date );
		tomorrow = new Date( $scope.year, $scope.month-1, $scope.date );
		tomorrow.setDate( today.getDate() + 1 );
		getLastTime();
	}
	
	getLastTime = function ( ) {
		$scope.lastTime = new mockupFactory.ordersResource();
		$scope.lastTime.$getLastTime( null, null ).then( function () {
			$scope.orders =  mockupFactory.ordersResource.openbetween( { 
				from: today.getTime(), //new Date($scope.lastTime.date).getTime(),
				to: tomorrow.getTime()//now.getTime()
			}, function ( ) {
/*
			$scope.orders = mockupFactory.ordersResource.query( { 
				user: 'All'
			}, function () {
/**/
				console.log('!!');;;
				console.log($scope.orders);;;
			});
		});
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