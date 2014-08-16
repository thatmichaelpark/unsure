mockupApp.controller( 'EditCustomerCtrl', function ( $scope, $http, $location, mockupFactory ) {

	$scope.data = {};
	
    $scope.save = function () {
		$scope.data.customer = new mockupFactory.customersResource( $scope.data.customer ).$save()
		.then( function ( stuff ) {
//			console.log( 'success: ' + stuff );;;
		})
		.catch( function ( stuff ) {
			alert( 'fail (contact mp): ' + stuff );;;
			console.log( stuff );;;
		});
    }
	
	$scope.cancel = function ( ) {
		alert('cancel');;;
	}
	
	$scope.clear = function () {
		$scope.data.customer = {};
    };
});

