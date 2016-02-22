//http://www.chroder.com/2014/02/01/using-ngmodelcontroller-with-custom-directives/
var unsureApp = angular.module( 'unsureApp', ['ngSanitize', 'ngResource', 'ui.bootstrap', 'ngRoute'] );

var baseUrl = 'http://10.0.20.101:3000/';
//var baseUrl = 'http://localhost:3000/';
unsureApp.constant( 'baseOrdersUrl', baseUrl + 'orders/' );
unsureApp.constant( 'baseCustomersUrl', baseUrl + 'customers/' );
unsureApp.constant( 'baseInventoryUrl', baseUrl + 'inventory/' );
unsureApp.constant( 'baseUsersUrl', baseUrl + 'users/' );

unsureApp.config( function ( $routeProvider, $locationProvider ) {

	$locationProvider.html5Mode( true );
	
	$routeProvider.when( '/joblist/:orderNo', { templateUrl: '/joblist/joblist.html' } );
	$routeProvider.when( '/createorder/', { templateUrl: '/createorder/createorder.html' } );
	$routeProvider.when( '/customers/:custNo', { templateUrl: '/customers/customers.html' } );
	$routeProvider.when( '/inventory', { templateUrl: '/inventory/inventory.html' } );
	$routeProvider.when( '/dailyclosing', { templateUrl: '/dailyclosing/dailyclosing.html' } );
	$routeProvider.when( '/other', { templateUrl: '/other.html' } );
	$routeProvider.otherwise( { templateUrl: '/joblist/joblist.html' } );
});

unsureApp.controller( 'UnsureCtrl', function ( $scope, resourceFactory, $timeout, orderService ) {

	$scope.ordersResource = resourceFactory.ordersResource;
	$scope.customersResource = resourceFactory.customersResource;
	$scope.inventoryResource = resourceFactory.inventoryResource;
	$scope.orderService = orderService;
	
	$scope.data = {};

	$scope.users = [];
	$scope.allUsers = [];

	resourceFactory.usersResource.query().$promise.then(function (userdata) {
		for (var i=0; i<userdata.length; ++i) {
			var name = userdata[i].name;
			if (name != 'All' && name != 'Front' && name != 'Techs') {
				$scope.users.push(name);
				$scope.allUsers.push(name);
			}
		}
		$scope.users.sort();
		$scope.users.push('Front');

		$scope.allUsers.sort();
		$scope.allUsers.push('Techs');
		$scope.allUsers.push('Front');
		$scope.allUsers.push('All');
	});

	orderService.data.currentUser = 'Front';
	orderService.data.currentView = 'Front';
	orderService.viewChanged();
});


