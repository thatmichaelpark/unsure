unsureApp.factory( 'resourceFactory', function ( $resource, baseOrdersUrl, baseCustomersUrl, baseInventoryUrl, baseUsersUrl ) {

	var timerId; // for setInterval in joblist
	
	return {
		ordersResource: $resource( baseOrdersUrl + 'byassignee/:user', { orderNo: '@orderNo', custNo: '@custNo', id : '@_id', from: '@from', to: '@to' },
			{
				get: { method : 'GET', url : baseOrdersUrl + 'byorderno/:orderNo' },
				getbycustno: { method : 'GET', url : baseOrdersUrl + 'bycustno/:custNo', isArray: true },
				add: { method : 'POST', url : baseOrdersUrl + 'add/' },
				save: { method : 'PUT', url : baseOrdersUrl + 'update/:id' },
				delete : { method : 'DELETE', url : baseOrdersUrl + 'delete/:id' },
				getLastTime: { method: 'GET', url: baseOrdersUrl + 'lastTime/' },
				modifiedbetween: { method: 'GET', url: baseOrdersUrl + 'modifiedbetween/:from/:to', isArray: true },
				openbetween: { method: 'GET', url: baseOrdersUrl + 'openbetween/:from/:to', isArray: true },
				createdbetween: { method: 'GET', url: baseOrdersUrl + 'createdbetween/:from/:to', isArray: true },
				closedbetween: { method: 'GET', url: baseOrdersUrl + 'closedbetween/:from/:to', isArray: true }
			}
		),
		customersResource: $resource( baseCustomersUrl + 'all', { custNo: '@custNo', id : '@_id' },
			{
				get: { method : 'GET', url : baseCustomersUrl + 'bycustno/:custNo' },
				add: { method : 'POST', url : baseCustomersUrl + 'add/' },
				save: { method : 'PUT', url : baseCustomersUrl + 'update/:id' },
				delete : { method : 'DELETE', url : baseCustomersUrl + 'delete/:id' }
			}
		),
		inventoryResource: $resource( baseInventoryUrl + 'all', { sku: '@sku', id : '@_id' },
			{
				get: { method: 'GET', url: baseInventoryUrl + 'bysku/:sku' },
				add: { method: 'POST', url: baseInventoryUrl + 'add/' },
				save: { method: 'PUT', url: baseInventoryUrl + 'update/:id' },
				delete: { method: 'DELETE', url: baseInventoryUrl + 'delete/:id' }
			}
		),
		usersResource: $resource( baseUsersUrl + 'all', { userName: '@userName', id : '@_id' },
			{
				get: { method : 'GET', url : baseUsersUrl + 'byusername/:userName' },
				add: { method : 'POST', url : baseUsersUrl + 'add/' },
				save: { method : 'PUT', url : baseUsersUrl + 'update/:id' },
				delete : { method : 'DELETE', url : baseUsersUrl + 'delete/:id' }
			}
		),
		timerId: timerId
	};
});

unsureApp.factory( 'sortPredicateFactory', function ( ) {
	var predicate = "orderNo"
	return {
		data: { predicate: predicate }
	};
});

