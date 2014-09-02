 mockupApp.controller( 'DailyClosingCtrl', function ( $scope, mockupFactory, $location ) {

	var now = new Date();
	
	getLastTime = function ( ) {
		$scope.lastTime = new mockupFactory.ordersResource();
		$scope.lastTime.$getLastTime( null, null ).then( function () {
			$scope.orders
			= 
			mockupFactory.
			ordersResource.
			between( { 
				from: new Date($scope.lastTime.date).getTime(),
				to: now.getTime()
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
	
	getLastTime();
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