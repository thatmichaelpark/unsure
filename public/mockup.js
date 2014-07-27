//http://www.chroder.com/2014/02/01/using-ngmodelcontroller-with-custom-directives/
var mockupApp = angular.module( 'mockupApp', ['ngSanitize', 'ngResource', 'ui.bootstrap', 'ngRoute'] );

var baseUrl = 'http://10.0.0.191:3000/';
//var baseUrl = 'http://localhost:3000/';
mockupApp.constant( 'baseOrdersUrl', baseUrl + 'orders/' );
mockupApp.constant( 'baseCustomersUrl', baseUrl + 'customers/' );
mockupApp.constant( 'baseInventoryUrl', baseUrl + 'inventory/' );
mockupApp.config( function ( $routeProvider, $locationProvider ) {

	$locationProvider.html5Mode( true );
	
	$routeProvider.when( '/joblist/:orderNo', { templateUrl: '/joblist.html' } );
	$routeProvider.when( '/createorder', { templateUrl: '/createorder.html' } );
	$routeProvider.when( '/customers', { templateUrl: '/customers.html' } );
	$routeProvider.when( '/inventory', { templateUrl: '/inventory.html' } );
	$routeProvider.otherwise( { templateUrl: '/joblist.html' } );
});

mockupApp.controller( 'MockupCtrl', function ( $scope, $resource, baseOrdersUrl, baseCustomersUrl, baseInventoryUrl, $timeout ) {

	$scope.ordersResource = $resource( baseOrdersUrl + 'byassignee/:user', { orderNo: '@orderNo', id : '@_id' },
		{
			get: { method : 'GET', url : baseOrdersUrl + 'byorderno/:orderNo' },
			add: { method : 'POST', url : baseOrdersUrl + 'add/' },
			save: { method : 'PUT', url : baseOrdersUrl + 'update/:id' },
			delete : { method : 'DELETE', url : baseOrdersUrl + 'delete/:id' }
		}
	);
	$scope.customersResource = $resource( baseCustomersUrl + 'all', { custNo: '@custNo', id : '@_id' },
		{
			get: { method : 'GET', url : baseCustomersUrl + 'bycustno/:custNo' },
			add: { method : 'POST', url : baseCustomersUrl + 'add/' },
			save: { method : 'PUT', url : baseCustomersUrl + 'update/:id' },
			delete : { method : 'DELETE', url : baseCustomersUrl + 'delete/:id' }
		}
	);
	$scope.inventoryResource = $resource( baseInventoryUrl + 'all', { sku: '@sku', id : '@_id' }
	);
	
	$scope.data = {};

	$scope.users = ['Doug', 'Justin', 'Michael'];
	$scope.currentUser = 'Michael';
	$scope.userChanged = function () {
		$scope.$broadcast( 'userChanged', $scope.currentUser );
	};
});

mockupApp.controller( 'JoblistCtrl', function ( $scope, $routeParams, $location ) {
	$scope.data.currentOrderNo = null;

	$scope.getOrders = function () {
		$scope.orders = $scope.ordersResource.query( { user: $scope.currentView }, function(){
			$scope.incomingOrders = [];
			$scope.activeOrders = [];
			for ( var i=0; i<$scope.orders.length; ++i ) {
				if ( $scope.orders[i].assignedTo == $scope.orders[i].assignedBy && $scope.orders[i].assignedTo == $scope.currentUser ) {
					$scope.activeOrders.push( $scope.orders[i] );
				} else {
					$scope.incomingOrders.push( $scope.orders[i] );
				}
				(function () {
					var index = i;
					var c = new $scope.customersResource();
					c.$get( { custNo: $scope.orders[index].custNo } ).then( function () {
						$scope.orders[index].custName = makeDisplayName( c );
					});
				}());
				if ( $scope.orders[i].orderNo === $scope.data.currentOrderNo ) {
					$scope.data.currentOrder = $scope.orders[i];
					$scope.data.currentOrderCopy = angular.copy( $scope.orders[i] );	// currentOrderCopy is a *copy* of an order. Edits are done on this copy.
				}
			}
		});
	}
	makeDisplayName = function ( c ) {
		var name = c.firstName + ' ' + c.lastName;
		if ( c.companyName ) {
			name += ' (' + c.companyName + ')';
		}
		return name;
	}
	
	$scope.getInventory = function () {
		$scope.inventory = $scope.inventoryResource.query();
	}
	$scope.getInventory();
	$scope.allUsers = ['Doug', 'Justin', 'Michael', 'Techs', 'Front', 'All'];
	$scope.currentView = 'All';

	$scope.getOrders();

	$scope.$on( 'userChanged', function ( e, u ) {
		$scope.currentView = u;
		$scope.getOrders();
	});
	
	$scope.viewChanged = function () {
		$scope.getOrders();
//		$timeout( function () {
//			$scope.data.currentView = $scope.currentUser;
//			$scope.getOrders();
//		}, 5000 );
	}
/**/
	setInterval( function () {
		if ( $scope.unchanged ) {
			$scope.getOrders();
		}
	}, 60000 );
/**/	
	
	$scope.assign = function () {
//		$scope.foind($scope.orders, 'orderid', $scope.data.currentOrderId).assignedBy = currentUser;
	}
	$scope.statuses = ['Intake', 'Checked in', 'In diags', 'Needs approval', 'Work approved', 'In progress', , 'Yours!', 'Part request',
	'Part ordered', 'Part received', 'Service complete', 'Customer notified'];

	$scope.unchanged = true;

	$scope.clickOrder = function( o ) {
		if ( $scope.unchanged ) {
			$scope.data.currentOrderNo = o.orderNo;
			$scope.getOrders();
		}	
	}
	$scope.$on( '$routeChangeSuccess', function () {
		if ( $location.path().indexOf( '/joblist/' ) == 0 ) {
			$scope.data.currentOrderNo = Number( $routeParams.orderNo );
			$scope.getOrders(); //hack
		}
	});
});

mockupApp.controller( 'OrderCtrl', function ( $scope ) {
	$scope.clickEditItem = function ( i ) {
		i.edit = true;
		$scope.unchanged = false;
	}
	$scope.clickAddItem = function () {
		$scope.data.currentOrderCopy.bill.push( { edit: true } );
		$scope.unchanged = false;
	}

	$scope.onSelectInventory = function ( $item, item ) {
		item.sku = $item.sku;
		item.desc = $item.desc;
		item.price = $item.price;
		item.qty = 1;
	}

	$scope.subtotal = function () {
		if ( angular.isDefined( $scope.data.currentOrderCopy ) && angular.isDefined( $scope.data.currentOrderCopy.bill ) ) {
			var t = 0;
			for ( var i=0; i<$scope.data.currentOrderCopy.bill.length; ++i ) {
				t += $scope.data.currentOrderCopy.bill[i].qty * $scope.data.currentOrderCopy.bill[i].price;
			}
			return t;
		}
	}
	$scope.tax = function () {
		if ( angular.isDefined( $scope.data.currentOrderCopy ) && angular.isDefined( $scope.data.currentOrderCopy.bill ) ) {
			var t = 0;
			for ( var i=0; i<$scope.data.currentOrderCopy.bill.length; ++i ) {
//				if ( $scoope.data.currentOrderCopy.bill[i].taxable ) {
					t += $scope.data.currentOrderCopy.bill[i].qty * $scope.data.currentOrderCopy.bill[i].price;
//				}
			}
			return t * 0.095;
		}
	}

	$scope.clickEditNote = function ( n ) {
		n.edit = true;
		$scope.unchanged = false;
	}
	$scope.clickAddNote = function () {
		$scope.data.currentOrderCopy.notes.push( { date: new Date(), by: $scope.currentUser, note: '', edit: true } );
		$scope.unchanged = false;
	}

	$scope.clickEditInternalNote = function ( ) {
		$scope.data.currentOrderCopy.internalNoteEdit = true;
		$scope.unchanged = false;
	}
	
	$scope.clickOk = function ( ) {
		$scope.unchanged = true;
		if( ($scope.data.currentOrder.status !== $scope.data.currentOrderCopy.status)
			|| ($scope.data.currentOrder.assignedTo !== $scope.data.currentOrderCopy.assignedTo) 
			|| ($scope.data.currentOrder.assignedBy !== $scope.data.currentOrderCopy.assignedBy) ) {
			$scope.data.currentOrderCopy.assignedBy = $scope.currentUser;
			$scope.data.currentOrderCopy.notes.push( { date: new Date(), by: $scope.currentUser, note:
				$scope.data.currentOrder.status + '/' + $scope.data.currentOrder.assignedTo + ' => ' +
				$scope.data.currentOrderCopy.status + '/' + $scope.data.currentOrderCopy.assignedTo } );
		}
		for ( var i=0; i<$scope.data.currentOrderCopy.notes.length; ++i ) {
			delete $scope.data.currentOrderCopy.notes[i].edit;
		}
		for ( var i=0; i<$scope.data.currentOrderCopy.bill.length; ++i ) {
			delete $scope.data.currentOrderCopy.bill[i].edit;
		}
		delete $scope.data.currentOrderCopy.internalNoteEdit;
		$scope.data.currentOrder = angular.copy( $scope.data.currentOrderCopy );
		new $scope.ordersResource( $scope.data.currentOrder ).$save().then(
			function () { console.log('ok'); $scope.getOrders(); },
			function () { console.log('wah');;;alert( 'wah-wah' ); }
		);
	}
	$scope.clickCancel = function ( ) {
		$scope.data.currentOrderCopy = angular.copy( $scope.data.currentOrder );
		$scope.unchanged = true;
	}
	$scope.changeStatus = function () {
		$scope.data.currentOrder.assignedTo = $scope.currentUser;
		$scope.data.currentOrder.assignedBy = $scope.currentUser;
		$scope.unchanged = false;
	}
	$scope.changeAssignedTo = function () {
		$scope.data.currentOrder.assignedBy = $scope.currentUser;
		$scope.unchanged = false;
	}
	$scope.changeAssignedBy = function () {
		$scope.unchanged = false;
	}

	$scope.data.showStatusChangesCheckbox = false;

	$scope.showStatusChanges = function ( note ) {
		if ( angular.isDefined( note ) ) {
			return $scope.data.showStatusChangesCheckbox || note.indexOf( '=>' ) < 0;
		}
		return false;
	}
})

mockupApp.controller( 'SortableTableCtrl', function ( $scope ) {
	$scope.predicate = 'orderNo';
	$scope.customSorter = function ( order ) {
		return order[ $scope.predicate ];
	}
});

mockupApp.controller( 'CreateOrderCtrl', function ( $scope, $http, $location ) {

	$scope.data = {};
	
    $scope.ok = function () {
		if ( !$scope.data.customer.custNo ) {
			// new customer: get new cust #, add cust to db, create new order
			$http.get("/customers/nextCustNo").success(function(custNo){
				$scope.data.customer.custNo = Number(custNo);
				$http.post('/customers/addcustomer/', $scope.data.customer );
				createNewOrder();
			});
		} else {
			// existing customer: just create new order
			createNewOrder();
		}
		
		function createNewOrder() {
			$http.get("/orders/nextOrderNo").success( function ( orderNo ){
				$scope.currentOrderNo = Number(orderNo);
				$scope.currentOrder = {};
				$scope.currentOrder.orderNo = Number(orderNo);
				$scope.currentOrder.custNo = $scope.data.customer.custNo;
				$scope.currentOrder.custName = makeDisplayName( $scope.data.customer );
				$scope.currentOrder.bill = [];
				$scope.currentOrder.notes = [ { date: new Date(), by: $scope.currentUser, note: $scope.data.note } ];
				$scope.currentOrder.internalNote = '';
				$scope.currentOrder.status = "Intake";
				$scope.currentOrder.assignedTo = $scope.currentUser;
				$scope.currentOrder.assignedBy = $scope.currentUser;
				new $scope.ordersResource( $scope.currentOrder ).$add().then(function(){
					$location.path( '/joblist/' + orderNo );
				});
			});
		}
    }
	
	$scope.clear = function () {
		$scope.data.customer = {};
    };
});

mockupApp.filter("nl2br", function($filter) {
 return function(data) {
   if (!data) return data;
   return data.replace(/\n\r?/g, '<br />');
 };
});

mockupApp.filter( 'blah', function ( $filter ) {
	return function ( data, name ) {
		// split name into names
		var re = /(\w+)/g;
		var names = [];
		var n;
		while ( n = re.exec( name ) ) {
			names.push( n[0] );
		}
		var result = data;
		for ( var i=0; i<names.length; ++i ) {
			result = $filter( 'filter' )( result, names[i] );
		}
		return result;
	}
});
mockupApp.controller( 'TypeaheadCtrl', 
	function TypeaheadCtrl($scope, $http) {
			
		getCustomers = function () {
			$http.get("/customers/all").success(function(data){
				$scope.customers = data;
			});
		};
		
		getCustomers();
		
		$scope.nameMaker = function( c ) {
			if ( angular.isDefined( c ) ) {
				var n = c.firstName + ' ' + c.lastName;
				if ( c.companyName ) {
					n += ' (' + c.companyName + ')';
				}
				return n;
			}
		}
		$scope.customer = [];
		$scope.onSelectPart = function ( item ) {
			$scope.data.customer = angular.copy( item );
		}
		$scope.blur = function () {
			var firstName = function(s) {
				var re = /(\w+)/g;
				var f = re.exec(s);
				if ( f ) {
					f = f[0];
					return f;
				}
			}
			var lastName = function(s) {
				var re = /(\w+)/g;
				re.exec(s)
				l = re.exec(s);
				if ( l ) {
					l = l[0];
					return l;
				}
			}
			if ( !angular.isObject( $scope.customerSelected ) ) {
				$scope.data.customer = [];
				$scope.data.customer.firstName = firstName($scope.customerSelected);
				$scope.data.customer.LastName = lastName($scope.customerSelected);
			}
		}
	}
);
