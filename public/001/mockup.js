//http://www.chroder.com/2014/02/01/using-ngmodelcontroller-with-custom-directives/
var mockupApp = angular.module( 'mockupApp', ['ngSanitize'] );
mockupApp.controller( 'mockupCtrl', function ( $scope ) {
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
	$scope.currentOrderId = "";
	$scope.foind = function( xs, p, v )
	{
		for ( var i in xs ) {
			if ( xs[i][p] === v ) {
				return xs[i];
			}
		}
	}
	$scope.assign = function () {
		$scope.foind($scope.orders, 'orderid', $scope.currentOrderId).assignedBy = currentUser;
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
	$scope.click = function( o ) {
		$scope.currentOrderId = o.orderid;
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
		if ( $scope.currentOrderId ) {
			var o = $scope.foind($scope.orders, 'orderid', $scope.currentOrderId);
			$scope.currentOrder = angular.copy( o );
			$scope.mode = 'edit';
		}
	}
	$scope.okClick = function ()  {
		for ( var i=0; i<$scope.orders.length; ++i ) {
			if ( $scope.orders[i].orderid === $scope.currentOrderId ) {
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