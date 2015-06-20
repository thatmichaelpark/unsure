//http://www.chroder.com/2014/02/01/using-ngmodelcontroller-with-custom-directives/
var unsureApp = angular.module( 'unsureApp', ['ngSanitize', 'ngResource', 'ui.bootstrap', 'ngRoute'] );

var baseUrl = 'http://10.0.20.101:3002/';
//var baseUrl = 'http://localhost:3000/';
unsureApp.constant( 'baseOrdersUrl', baseUrl + 'orders/' );
unsureApp.constant( 'baseCustomersUrl', baseUrl + 'customers/' );
unsureApp.constant( 'baseInventoryUrl', baseUrl + 'inventory/' );
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

unsureApp.controller( 'UnsureCtrl', function ( $scope, resourceFactory, $timeout ) {

	$scope.ordersResource = resourceFactory.ordersResource;
	$scope.customersResource = resourceFactory.customersResource;
	$scope.inventoryResource = resourceFactory.inventoryResource;
	
	$scope.data = {};

	$scope.users = ['Davis', 'Michael', 'Sam', 'Sergey', 'Tony', 'Front'];
	$scope.currentUser = 'Front';
	$scope.userChanged = function () {
		$scope.$broadcast( 'userChanged', $scope.currentUser );
	};
	$scope.data.currentView = 'Front';

});

