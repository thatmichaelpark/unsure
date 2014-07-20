//http://www.chroder.com/2014/02/01/using-ngmodelcontroller-with-custom-directives/
var mockupApp = angular.module( 'mockupApp', ['ngSanitize', 'ui.bootstrap'] );

mockupApp.controller( 'mockupCtrl', function ( $scope ) {
	$scope.data = {};
	$scope.customers = [
		{ custid: "100", name: 'Ann Onymous', phone: '206-123-3456' },
		{ custid: "101", name: 'No Name', phone: '425-123-3456' },
		{ custid: "102", name: 'Sue D\'Onym', phone: '206-555-3456' },
		{ custid: "103", name: 'Noah Boddy', phone: '206-867-3456' },
		{ custid: "104", name: 'Secret Identity', phone: '253-123-3456' }
	];
	$scope.orders = [
		{ orderid: "8000", custid: "103", status: "Intake", assignedTo: 'Michael', assignedBy: '',
			notes: [ {note: 'so much' }, { note: 'wtf?' }, { note: 'glurb' } ] },
		{ orderid: "8011", custid: "102", status: "Needs approval", assignedTo: 'Michael', assignedBy: 'Michael',
			notes: [ { note: 'cannot fix' }, { note: 'ttc' }, { note: 'brb' }, { note: 'omg!' } ] },
		{ orderid: "8002", custid: "104", status: "In diags", assignedTo: 'Doug', assignedBy: 'Doug',
			notes: [ { note: 'wtf?' }, { note: 'lol' } ] },
		{ orderid: "8004", custid: "100", status: "Checked in", assignedTo: 'Michael', assignedBy: '',
			notes: [ { note: 'you gotta be <strong>kidding</strong> me' } ] }
	];
	$scope.data.currentOrderId = "";
	$scope.foind = function( xs, p, v )
	{
		for ( var i in xs ) {
			if ( xs[i][p] === v ) {
				return xs[i];
			}
		}
	}
	$scope.assign = function () {
		$scope.foind($scope.orders, 'orderid', $scope.data.currentOrderId).assignedBy = currentUser;
	}
	$scope.orderNumbers = function () {
		var nums = [];
		for ( var i in $scope.orders ) {
			nums.push( $scope.orders[i].orderid );
		}
		return nums;
	}
	$scope.users = ['Doug', 'Justin', 'Michael'];
	$scope.statuses = ['Intake', 'Checked in', 'In diags', 'Needs approval', 'Work approved', 'Service complete', 'Customer notified'];
	$scope.currentUser = 'Michael';
	$scope.data.currentOrderId = null;
	$scope.click = function( o ) {
		$scope.data.currentOrderId = o.orderid;
	}
	$scope.incomingOrders = function () {
		var o = [];
		for( var i=0; i<$scope.orders.length; ++i ) {
///			alert($scope.orders[i].assignedTo + ', ' + orders[i].assignedBy );;;
			if ( $scope.orders[i].assignedTo === $scope.currentUser && $scope.orders[i].assignedBy !== $scope.currentUser ) {
				o.push( $scope.orders[i] );
			}
		}
		return o;
	}
	$scope.activeOrders = function () {
		var o = [];
		for( var i=0; i<$scope.orders.length; ++i ) {
			if ( $scope.orders[i].assignedTo === $scope.currentUser && $scope.orders[i].assignedBy === $scope.currentUser ) {
				o.push( $scope.orders[i] );
			}
		}
		return o;
	}
	$scope.predicate = 'orderid';
	$scope.customSorter = function ( order ) {
		if ( $scope.predicate === 'name' ) {
			var z = $scope.foind( $scope.customers, 'custid', order.custid ).name;
			return z;
		} else {
			return order[$scope.predicate];
		}
	}
	$scope.mode = 'view';
	$scope.viewOrEdit = function () {
		return 'mockup' + $scope.mode + '.html';
	}
	$scope.editClick = function () {
		if ( $scope.data.currentOrderId ) {
			var o = $scope.foind($scope.orders, 'orderid', $scope.data.currentOrderId);
			$scope.currentOrder = angular.copy( o );
			$scope.mode = 'edit';
		}
	}
	$scope.okClick = function ()  {
		for ( var i=0; i<$scope.orders.length; ++i ) {
			if ( $scope.orders[i].orderid === $scope.data.currentOrderId ) {
				$scope.orders[i] = $scope.currentOrder;
			}
		}
		$scope.currentOrder = {};
		$scope.mode = 'view';
	}
	$scope.cancelClick = function ()  {
		$scope.currentOrder = {};
		$scope.mode = 'view';
	}
	$scope.statusChange = function () {
		$scope.currentOrder.assignedTo = $scope.currentUser;
		$scope.currentOrder.assignedBy = $scope.currentUser;
	}
	$scope.assignedChange = function () {
		$scope.currentOrder.assignedBy = $scope.currentUser;
	}
})
.directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      // view -> model
      element.bind('blur', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(element.html());
        });
      });

      // model -> view
      ctrl.$render = function() {
        element.html(ctrl.$viewValue);
      };

      // load init value from DOM
      ///ctrl.$setViewValue(element.html());
    }
  };
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
				customerCopy : {
				}
			};
        }
      }
    });

    modalInstance.result.then(function (data) {
		$scope.data.currentOrderId = data.customerCopy['Account Number'];
		if ( data.customerCopy['Account Number'] ) {
		} else {
			$http.get("/customers/nextCustNo").success(function(custNo){
				data.customerCopy['Account Number'] = Number(custNo);
				$http.post('/customers/addcustomer/', data.customerCopy );
				console.log(data.customerCopy);;;
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
						$http.get("/customers/customers").success(function(data){
							$scope.customers = data;
						});
					};
					
					getCustomers();
					
					$scope.nameMaker = function( c ) {
						if ( angular.isDefined( c ) ) {
							var n = c['First Name'] + ' ' + c['Last Name'];
							if ( c['Company Name'] ) {
								n += ' (' + c['Company Name'] + ')';
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
							$scope.data.customerCopy['First Name'] = firstName($scope.customerSelected);
							$scope.data.customerCopy['Last Name'] = lastName($scope.customerSelected);
						}
					}
				}
			);
