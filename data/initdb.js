conn = new Mongo();
db = conn.getDB("mockup");

db.customers.drop();
db.orders.drop();

db.users.drop();
db.users.insert( { 'name': 'Michael', 'group': ['Front', 'All']});
db.users.insert( { 'name': 'Doug', 'group': ['Techs', 'All']});
db.users.insert( { 'name': 'Justin', 'group': ['Techs', 'All']});
db.users.insert( { 'name': 'Techs', 'group': ['Doug', 'Justin', 'All']});
db.users.insert( { 'name': 'Front', 'group': ['Michael', 'All']});
db.users.insert( { 'name': 'All', 'group': ['Michael', 'Doug', 'Justin', 'Techs', 'Front']});

db.nominalNumbers.drop();
db.nominalNumbers.insert( { 'type': 'cust', 'no': 5000 } );
db.nominalNumbers.insert( { 'type': 'order', 'no': 9000 } );

db.inventory.drop();
db.inventory.insert( { sku: 'DIAGS', desc: 'Diagnostics', price: 45.00, qty: 0, taxable: true } );
db.inventory.insert( { sku: 'TL', desc: "Technician's Labor", price: 90.00, qty: 0, taxable: true } );
