var express = require('express');
var router = express.Router();

/*
/*
 * GET inventory
 */
router.get('/all', function(req, res) {
	var db = req.db;
	db.collection('inventory').find().toArray(function (err, items) {
		res.json(items);
	});
});

router.get('/bysku/:sku', function(req, res) {
	var db = req.db;
	db.collection('sku').find( { sku: req.params.sku } ).toArray(function (err, items) {
		res.json(items);
	});
});

/*
 * POST to add 
 */
router.post('/add', function(req, res) {
    var db = req.db;
    db.collection('inventory').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * PUT to update order.
 */
router.put('/update/:id', function( req, res ) {
	var db = req.db;
	var inventoryToUpdate = req.params.id;
	delete req.body._id;
	db.collection( 'inventory' ).updateById( inventoryToUpdate, req.body, function ( err, result ) {
		res.send( err === null ? { msg: '' } : { msg: err } );
	});
});

module.exports = router;
