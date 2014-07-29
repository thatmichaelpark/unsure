var express = require('express');
var router = express.Router();

/* GET orders listing. */
/*
 * GET orders.
 */
router.get('/all', function(req, res) {
	var db = req.db;
	db.collection('orders').find().toArray(function (err, items) {
		res.json(items);
	});
});

router.get('/byassignee/:user', function(req, res) {
	var db = req.db;
	db.collection('users').findOne( { name: req.params.user }, function ( err, result ) {
		var a = result.group;
		console.log(a);;;
		a.push( req.params.user );
		db.collection('orders').find( { $and: [ { assignedTo: { $in: a } }, { status: { $ne: 'Closed' } } ] } ).toArray(function (err, items) {
			res.json(items);
		});
	});
});

/*
 * POST to add order
 */
router.post('/add', function(req, res) {
    var db = req.db;
	console.log('add order: ' + req.body);;;
    db.collection('orders').insert(req.body, function(err, result){
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
	var orderToUpdate = req.params.id;
	delete req.body._id;
	db.collection( 'orders' ).updateById( orderToUpdate, req.body, function ( err, result ) {
		res.send( err === null ? { msg: '' } : { msg: err } );
	});
});

router.get('/nextOrderNo', function(req, res) {
	var db = req.db;
	db.collection('nominalNumbers').findOne( { type: 'order' }, function(err, result) {
		if (err) throw err;
		db.collection('nominalNumbers').update( { type: 'order' }, { '$inc': { no: 1 } }, function ( err ) {
			if ( err ) {
				throw err;
			}
			res.json( result.no );
		});
	});
});

module.exports = router;
