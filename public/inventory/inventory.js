unsureApp.controller( 'InventoryCtrl', function ( $scope, resourceFactory, $location ) {

	getInventory = function ( ) {
		$scope.inventory = resourceFactory.inventoryResource.query( {}, function(){
			$scope.item = {};
		});
	}
	
	getInventory();
	
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
	}
});