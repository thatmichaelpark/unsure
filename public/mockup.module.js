//http://www.chroder.com/2014/02/01/using-ngmodelcontroller-with-custom-directives/
var mockupApp = angular.module( 'mockupApp', ['ngSanitize', 'ngResource', 'ui.bootstrap', 'ngRoute'] );

var baseUrl = 'http://10.0.0.191:3000/';
//var baseUrl = 'http://localhost:3000/';
mockupApp.constant( 'baseOrdersUrl', baseUrl + 'orders/' );
mockupApp.constant( 'baseCustomersUrl', baseUrl + 'customers/' );
mockupApp.constant( 'baseInventoryUrl', baseUrl + 'inventory/' );
mockupApp.config( function ( $routeProvider, $locationProvider ) {

	$locationProvider.html5Mode( true );
	
	$routeProvider.when( '/joblist/:orderNo', { templateUrl: '/joblist/joblist.html' } );
	$routeProvider.when( '/createorder', { templateUrl: '/createorder/createorder.html' } );
	$routeProvider.when( '/customers', { templateUrl: '/customers/customers.html' } );
	$routeProvider.when( '/inventory', { templateUrl: '/inventory/inventory.html' } );
	$routeProvider.otherwise( { templateUrl: '/joblist/joblist.html' } );
});

mockupApp.controller( 'MockupCtrl', function ( $scope, mockupFactory, $timeout ) {

	$scope.ordersResource = mockupFactory.ordersResource;
	$scope.customersResource = mockupFactory.customersResource;
	$scope.inventoryResource = mockupFactory.inventoryResource;
	
	$scope.data = {};

	$scope.users = ['Doug', 'Justin', 'Michael'];
	$scope.currentUser = 'Michael';
	$scope.userChanged = function () {
		$scope.$broadcast( 'userChanged', $scope.currentUser );
	};
	$scope.data.currentView = 'All';

});


