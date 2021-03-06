unsureApp.controller( 'EditCustomerCtrl', function ( $scope, $http, $location, resourceFactory, $routeParams, orderService ) {

	$scope.data = {};

	$scope.$on( '$routeChangeSuccess', function () {
		if ( $location.path().indexOf( '/customers/' ) == 0 ) {
			getCustomer( $routeParams.custNo );
			orderService.setCustNo( $routeParams.custNo );
			//getOrders( $routeParams.custNo );
		}
	});
	
	function getOrders( custNo ) {
		$scope.data.orders = resourceFactory.ordersResource.getbycustno( { custNo: custNo }, function () {} );
	}
	function getCustomer( custNo ) {
		$scope.data.customer = new resourceFactory.customersResource();
		$scope.data.customer.$get( { custNo: custNo } ).then ( function () {
		}).catch( function (e) {
			console.log( 'nope ' + e );;;
		});
	}

    $scope.save = function () {
		new mockupFactory.customersResource( $scope.data.customer ).$save()
		.then( function ( stuff ) {
//			console.log( 'success: ' + stuff );;;
		})
		.catch( function ( stuff ) {
			alert( 'fail (contact mp): ' + stuff );;;
			console.log( stuff );;;
		});
    }
	
	$scope.clear = function () {
		$scope.data.customer = {};
    };
});

