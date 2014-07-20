//http://www.chroder.com/2014/02/01/using-ngmodelcontroller-with-custom-directives/
var mockupApp = angular.module( 'mockupApp', ['ngSanitize', 'ngResource', 'ui.bootstrap'] );

var baseUrl = 'http://10.0.0.191:3000/';
//var baseUrl = 'http://localhost:3000/';
mockupApp.constant( 'baseOrdersUrl', baseUrl + 'orders/' );
mockupApp.constant( 'baseCustomersUrl', baseUrl + 'customers/' );
mockupApp.constant( 'baseInventoryUrl', baseUrl + 'inventory/' );
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
	
	$scope.users = ['Doug', 'Justin', 'Michael'];
	$scope.currentUser = 'Michael';
	$scope.allUsers = ['Doug', 'Justin', 'Michael', 'Techs', 'Front', 'All'];
	$scope.currentView = 'All';

	$scope.getOrders();
	
	$scope.userChanged = function () {
		$scope.currentView = $scope.currentUser;
		$scope.getOrders();
	}
	$scope.viewChanged = function () {
		$scope.getOrders();
//		$timeout( function () {
//			$scope.currentView = $scope.currentUser;
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
	$scope.data = {};
	$scope.data.currentOrderNo = null;
	
	$scope.assign = function () {
//		$scope.foind($scope.orders, 'orderid', $scope.data.currentOrderId).assignedBy = currentUser;
	}
	$scope.statuses = ['Intake', 'Checked in', 'In diags', 'Needs approval', 'Work approved', 'In progress', , 'Yours!', 'Part request',
	'Part ordered', 'Part received', 'Service complete', 'Customer notified'];

	$scope.unchanged = true;
	
	$scope.clickEditInternalNote = function ( ) {
		$scope.data.currentOrderCopy.internalNoteEdit = true;
		$scope.unchanged = false;
	}
	$scope.clickEditNote = function ( n ) {
		n.edit = true;
		$scope.unchanged = false;
	}
	$scope.clickEditItem = function ( i ) {
		i.edit = true;
		$scope.unchanged = false;
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
	$scope
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
	$scope.clickAddNote = function () {
		$scope.data.currentOrderCopy.notes.push( { date: new Date(), by: $scope.currentUser, note: '', edit: true } );
		$scope.unchanged = false;
	}
	$scope.clickAddItem = function () {
		$scope.data.currentOrderCopy.bill.push( { edit: true } );
		$scope.unchanged = false;
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

	$scope.onSelectInventory = function ( $item, item ) {
		item.sku = $item.sku;
		item.desc = $item.desc;
		item.price = $item.price;
		item.qty = 1;
	}

	$scope.clickOrder = function( o ) {
		if ( $scope.unchanged ) {
			$scope.data.currentOrderNo = o.orderNo;
			$scope.getOrders();
		}	
	}
	$scope.data.showStatusChangesCheckbox = false;
	$scope.showStatusChanges = function ( note ) {
		if ( angular.isDefined( note ) ) {
			return $scope.data.showStatusChangesCheckbox || note.indexOf( '=>' ) < 0;
		}
		return false;
	}
/**	$scope.predicate1 = 'orderNo';
	$scope.predicate2 = 'orderNo';
	$scope.customSorter1 = function ( order ) {
		return order[$scope.predicate1];
	}
	$scope.customSorter2 = function ( order ) {
		return order[$scope.predicate2];
	}/**/
})

mockupApp.controller( 'sortableTableCtrl', function ( $scope ) {
	$scope.predicate = 'orderNo';
	$scope.customSorter = function ( order ) {
		return order[ $scope.predicate ];
	}
});

mockupApp.controller( 'modalCtrl', function ( $scope, $modal, $http) {

  $scope.openNewOrderModal = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        data: function () {
			return {
				customerCopy : {},
				currentOrderCopy: $scope.data.currentOrderCopy
			};
        }
      }
    });

    modalInstance.result.then(function (data) {
		if ( !data.customerCopy.custNo ) {
			// new customer: get new cust #, add cust to db, create new order
			$http.get("/customers/nextCustNo").success(function(custNo){
				data.customerCopy.custNo = Number(custNo);
				$http.post('/customers/addcustomer/', data.customerCopy );
				createNewOrder();
			});
		} else {
			// existing customer: just create new order
			createNewOrder();
		}
		
		function createNewOrder() {
			$http.get("/orders/nextOrderNo").success(function(orderNo){
				console.log(orderNo + ', ' + data.customerCopy.custNo);;;
				$scope.data.currentOrderNo = Number(orderNo);
				$scope.data.currentOrder = {};
				$scope.data.currentOrder.orderNo = Number(orderNo);
				$scope.data.currentOrder.custNo = data.customerCopy.custNo;
				$scope.data.currentOrder.custName = makeDisplayName( data.customerCopy );
				$scope.data.currentOrder.bill = [];
				$scope.data.currentOrder.notes = [ { date: new Date(), by: $scope.currentUser, note: data.note } ];
				$scope.data.currentOrder.internalNote = '';
				$scope.data.currentOrder.status = "Intake";
				$scope.data.currentOrder.assignedTo = $scope.currentUser;
				$scope.data.currentOrder.assignedBy = $scope.currentUser;
				new $scope.ordersResource( $scope.data.currentOrder ).$add().then(function(){
					$scope.getOrders();
					$scope.data.currentOrderCopy = angular.copy( $scope.data.currentOrder );
				});
			});
		}
		
    }, function () {
//      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, data) {

  $scope.data = data;

  $scope.ok = function () {
    $modalInstance.close($scope.data);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
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
					$scope.customerCopy = [];
					$scope.onSelectPart = function ( item ) {
						$scope.data.customerCopy = angular.copy( item );
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
							$scope.data.customerCopy = [];
							$scope.data.customerCopy.firstName = firstName($scope.customerSelected);
							$scope.data.customerCopy.LastName = lastName($scope.customerSelected);
						}
					}
				}
			);
