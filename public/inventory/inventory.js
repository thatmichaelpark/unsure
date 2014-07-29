mockupApp.controller( 'InventoryCtrl', function ( $scope, mockupFactory, $location ) {

	getInventory = function ( ) {
		$scope.inventory = mockupFactory.inventoryResource.query( {}, function(){
			$scope.item = {};
		});
	}
	
	getInventory();
	
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
	}
});