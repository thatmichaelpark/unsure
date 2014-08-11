mockupApp.factory( 'mockupFactory', function ( $resource, baseOrdersUrl, baseCustomersUrl, baseInventoryUrl ) {

	return {
		ordersResource: $resource( baseOrdersUrl + 'byassignee/:user', { orderNo: '@orderNo', id : '@_id' },
			{
				get: { method : 'GET', url : baseOrdersUrl + 'byorderno/:orderNo' },
				add: { method : 'POST', url : baseOrdersUrl + 'add/' },
				save: { method : 'PUT', url : baseOrdersUrl + 'update/:id' },
				delete : { method : 'DELETE', url : baseOrdersUrl + 'delete/:id' }
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
		)
	};
});
