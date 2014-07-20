//http://www.chroder.com/2014/02/01/using-ngmodelcontroller-with-custom-directives/
var mockupApp = angular.module( 'mockupApp', ['ngSanitize', 'ngResource', 'ui.bootstrap'] );

mockupApp.constant( 'baseOrdersUrl', 'http://localhost:3000/orders/' );
mockupApp.constant( 'baseCustomersUrl', 'http://localhost:3000/customers/' );
mockupApp.controller( 'MockupCtrl', function ( $scope, $resource, baseOrdersUrl, baseCustomersUrl ) {

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
	$scope.getOrders = function () {
		$scope.orders = $scope.ordersResource.query( { user: $scope.currentUser }, function(){
			$scope.incomingOrders = [];
			$scope.activeOrders = [];
			for ( var i=0; i<$scope.orders.length; ++i ) {
				if ( $scope.orders[i].assignedTo == $scope.orders[i].assignedBy ) {
					$scope.activeOrders.push( $scope.orders[i] );
				} else {
					$scope.incomingOrders.push( $scope.orders[i] );
				}
				(function () {
					var index = i;
					var c = new $scope.customersResource();
					c.$get( { custNo: $scope.orders[index].custNo } ).then( function(){
						var name = c.firstName + ' ' + c.lastName;
						if ( c.companyName ) {
							name += ' (' + c.companyName + ')';
						}
						$scope.orders[index].custName = name;
					});
				}());
			}
		});
	}

	$scope.users = ['Doug', 'Justin', 'Michael', 'Techs', 'Front', 'All'];
	$scope.currentUser = 'Michael';

	$scope.getOrders();
	
	$scope.data = {};
	$scope.data.currentOrder = {};
	$scope.data.currentOrderCopy = {};
	$scope.data.currentOrderNo = null;
	
	$scope.assign = function () {
//		$scope.foind($scope.orders, 'orderid', $scope.data.currentOrderId).assignedBy = currentUser;
	}
	$scope.statuses = ['Intake', 'Checked in', 'In diags', 'Needs approval', 'Work approved', 'Service complete', 'Customer notified'];

	$scope.unchanged = true;
	
	$scope.clickOrder = function( o ) {
		if ( $scope.unchanged ) {
			$scope.data.currentOrderNo = o.orderNo;
			$scope.data.currentOrder = o;
			$scope.data.currentOrderCopy = angular.copy( o );	// currentOrderCopy is a *copy* of an order. Edits are done on this copy.
		}	
	}
	$scope.predicate = 'orderNo';
	$scope.customSorter = function ( order ) {
		return order[$scope.predicate];
	}
	
	$scope.clickEditNote = function ( n ) {
		n.edit = !n.edit;
		$scope.unchanged = false;
	}
	$scope.clickOk = function ( ) {
		$scope.unchanged = true;
		if( ($scope.data.currentOrder.status !== $scope.data.currentOrderCopy.status)
			|| ($scope.data.currentOrder.assignedTo !== $scope.data.currentOrderCopy.assignedTo)
			|| ($scope.data.currentOrder.assignedBy !== $scope.data.currentOrderCopy.assignedBy) ) {
			$scope.data.currentOrderCopy.notes.push( { date: 'today', by: $scope.currentUser, note:
				$scope.data.currentOrder.status + '/' + $scope.data.currentOrder.assignedTo + '/' + $scope.data.currentOrder.assignedBy
				+ ' => ' +
				$scope.data.currentOrderCopy.status + '/' + $scope.data.currentOrderCopy.assignedTo + '/' + $scope.data.currentOrderCopy.assignedBy } );
		}
		for ( var i=0; i<$scope.data.currentOrderCopy.notes.length; ++i ) {
			delete $scope.data.currentOrderCopy.notes[i].edit;
		}
		$scope.data.currentOrder = $scope.data.currentOrderCopy;
		$scope.data.currentOrder.$save().then(function(){
			$scope.getOrders();
		});
	}
	$scope.clickCancel = function ( ) {
		$scope.data.currentOrderCopy = angular.copy( $scope.data.currentOrder );
		$scope.unchanged = true;
	}
/**
	$scope.mode = 'view';
	$scope.viewOrEdit = function () {
		return 'mockup' + $scope.mode + '.html';
	}
	$scope.editClick = function () {
		if ( $scope.data.currentOrderNo ) {
			$scope.mode = 'edit';
		}
	}
	$scope.okClick = function ()  {
		for ( var i=0; i<$scope.orders.length; ++i ) {
			if ( $scope.orders[i].orderNo === $scope.data.currentOrderNo ) {
				$scope.orders[i] = $scope.data.currentOrder;
			}
		}
		$scope.data.currentOrder = {};
		$scope.mode = 'view';
	}
	$scope.cancelClick = function ()  {
		$scope.data.currentOrder = {};
		$scope.mode = 'view';
	}
**/
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
})

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
			// new customer: get new cust #, add cust to db
			$http.get("/customers/nextCustNo").success(function(custNo){
				data.customerCopy.custNo = Number(custNo);
				$http.post('/customers/addcustomer/', data.customerCopy );
			});
		} else {
			// existing customer; do nothing
		}
		// create new order
		$http.get("/orders/nextOrderNo").success(function(orderNo){
			delete( $scope.data.currentOrder._id );
			$scope.data.currentOrderNo = orderNo;
			$scope.data.currentOrder.orderNo = Number(orderNo);
			$scope.data.currentOrder.custNo = data.customerCopy.custNo;
			$scope.data.currentOrder.desc = data.desc;
			$scope.data.currentOrder.bill = [];
			$scope.data.currentOrder.notes = [];
			$scope.data.currentOrder.status = "Intake";
			$scope.data.currentOrder.assignedTo = $scope.currentUser;
			$scope.data.currentOrder.assignedBy = $scope.currentUser;
			new $scope.ordersResource( $scope.data.currentOrder ).$add().then(function(){$scope.getOrders();});
		});
    }, function () {
		console.log("cancel");;;
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

			mockupApp.filter( 'blah', function ( $filter ) {
				return function ( data, name ) {
					// split name into names
					var re = /(\w+)/g;
					var names = [];
					var n;
					while ( n = re.exec( name ) ) {
						names.push( n[0] );
						console.log(n[0]);;;
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
