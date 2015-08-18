unsureApp.factory( 'orderService', function ( $resource, resourceFactory ) {

	var data = {
		currentOrder: null,
		currentOrderNo: null,
		currentUser: null,
		currentView: null,
		jobslistView: null,
		unchanged: true
	};
	var ordersResource = resourceFactory.ordersResource;
	var customersResource = resourceFactory.customersResource;
	
	function getUserOrders() {
		var orders = ordersResource.query( { user: data.currentView }, function(){
			for (var i=0; i<orders.length; ++i) {	// compute order age
				var order = orders[i];
				order.age = (new Date() - new Date(order.modifiedDate)) / (24 * 60 * 60000); // days
			}
			data.incomingOrders = [];
			data.activeOrders = [];
			for ( var i=0; i<orders.length; ++i ) {
				if ( orders[i].assignedTo == orders[i].assignedBy && orders[i].assignedTo == data.currentUser ) {
					data.activeOrders.push( orders[i] );
				} else {
					data.incomingOrders.push( orders[i] );
				}
				(function () {		// here we add some info from the corresponding customer record.
					var index = i;
					var c = new customersResource();
					c.$get( { custNo: orders[index].custNo } ).then( function () {
						orders[index].custName = makeDisplayName( c );
						orders[index].phone1 = c.phone1;
						orders[index].phone2 = c.phone2;
					});
				}());
			}
		});
	}
	getAllOrders = function () {
		var orders = ordersResource.query( { user: data.currentView }, function(){
			for (var i=0; i<orders.length; ++i) {	// compute order age
				var order = orders[i];
				order.age = (new Date() - new Date(order.modifiedDate)) / (24 * 60 * 60000); // days
			}
			data.allOrders = [];
			for ( var i=0; i<orders.length; ++i ) {
				data.allOrders.push( orders[i] );
				(function () {
					var index = i;
					var c = new customersResource();
					c.$get( { custNo: orders[index].custNo } ).then( function () {
						orders[index].custName = makeDisplayName( c );
						orders[index].phone1 = c.phone1;
						orders[index].phone2 = c.phone2;
					});
				}());
			}
		});
	}
	var getTechOrders = function () {
		var orders = ordersResource.query( { user: 'Techs' }, function(){
			data.ordersOnBench = [];
			for (var i=0; i<orders.length; ++i) {
				var order = orders[i];
				order.age = (new Date() - new Date(order.modifiedDate)) / (24 * 60 * 60000); // days
				data.ordersOnBench.push(order);
			}
		});
		var orders2 = ordersResource.query( { user: 'Front' }, function(){
			data.ordersOther = [];
			for (var i=0; i<orders2.length; ++i) {
				var order = orders2[i];
				order.age = (new Date() - new Date(order.modifiedDate)) / (24 * 60 * 60000); // days
				data.ordersOther.push(order);
			}
		});
	}
	function makeDisplayName(c) {
		var name = c.lastName + ', ' + c.firstName;
		if ( c.companyName ) {
			name += ' (' + c.companyName + ')';
		}
		return name;
	}

	var getOrdersVar;
	
	function getOrders() {
		getOrdersVar();
	}
	
	function viewChanged() {
		if (data.currentView === 'All') {
			data.jobslistView = "joblist/alljobslist.html"
			getOrdersVar = getAllOrders;
		} else if (data.currentView === 'Techs') {
			data.jobslistView = "joblist/techjobslist.html"
			getOrdersVar = getTechOrders;
		} else {
			data.jobslistView = "joblist/userjobslist.html"
			getOrdersVar = getUserOrders;
		}
		getOrders();
	}
	function userChanged() {
		data.currentView = data.currentUser;
		viewChanged();
	};

	// use a timer to auto-refresh orders list
	// We only want one, so we kill the previous one.
	if ( angular.isDefined( resourceFactory.timerId ) ) {
	alert("this can't be happening!");
		clearInterval( resourceFactory.timerId );
	}
	resourceFactory.timerId = setInterval( function () {
		if ( data.unchanged ) {
			getOrders();
			if (data.currentOrder) {
				data.currentOrder.$get();
			}
		}
	}, 60000 );

	return {
		data: data,
		userChanged: userChanged,
		viewChanged: viewChanged,
		getOrders: getOrders
	}
})
