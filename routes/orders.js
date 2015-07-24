var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin');

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
		a.push( req.params.user );
		db.collection('orders').find( { $and: [ { assignedTo: { $in: a } }, { status: { $ne: 'Closed' } } ] } ).toArray(function (err, items) {
			res.json(items);
		});
	});
});

router.get('/bycustno/:custNo', function(req, res) {
	var db = req.db;
	db.collection('orders').find( { custNo: Number(req.params.custNo) } ).toArray(function (err, items) {
		res.json(items);
	});
});

router.get('/byorderno/:orderNo', function(req, res) {
	var db = req.db;
	db.collection('orders').findOne( { orderNo: Number(req.params.orderNo) }, function ( err, result ) {
		if ( err ) {
			console.log( err );
		} else {
			res.json( result );
		}
	});
});

/*
 * POST to add order
 */
router.post('/add', function(req, res) {
    var db = req.db;
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
	delete req.body._id;
	db.collection( 'orders' ).update( {_id: mongoskin.ObjectID(req.params.id)}, req.body, function ( err, result ) {
		res.send( err === null ? req.body : { msg: err } );
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

router.get('/lastTime', function(req, res) {
	var db = req.db;
	db.collection('lastTime').findOne( {}, function ( err, result ) {
		if ( err ) {
			throw err;
		}
		res.json(result);
	});
});

router.get('/modifiedbetween/:from/:to', function(req, res) {
	var db = req.db;
	var from = new Date(Number(req.params.from));
	var to = new Date(Number(req.params.to));
	db.collection('orders').find( { modifiedDate: { $gte: from, $lt: to } } ).toArray( function ( err, result ) {
		if ( err ) {
			throw err;
		}
		res.json( result );
	});
});

router.get('/openbetween/:from/:to', function(req, res) {
	var db = req.db;
	var from = new Date(Number(req.params.from));
	var to = new Date(Number(req.params.to));
	db.collection('orders').find(
		{ $and: [
			{ createdDate: { $lt: to } },
//			{ closedDate: { $exists: true, $gte: from } }
			{ $or: [
				{ closedDate: { $exists: true, $gte: from } },
				{ $and: [
					{closedDate: null },
					{ status: { $ne: 'Closed' } }
				] }
			] }
		] } 
	).toArray( function ( err, result ) {
		if ( err ) {
			throw err;
		}
		res.json( result );
	});
});

router.get('/createdbetween/:from/:to', function(req, res) {
	var db = req.db;
	var from = new Date(Number(req.params.from));
	var to = new Date(Number(req.params.to));
	db.collection('orders').find(
		{ $and: [
			{ status: { $ne: 'Closed' } },
			{ createdDate: { $gte: from } },
			{ createdDate: { $lt: to } }
		] } 
	).toArray( function ( err, result ) {
		if ( err ) {
			throw err;
		}
		res.json( result );
	});
});

router.get('/closedbetween/:from/:to', function(req, res) {
	var db = req.db;
	var from = new Date(Number(req.params.from));
	var to = new Date(Number(req.params.to));
	db.collection('orders').find(
		{ $and: [
			{ closedDate: { $gte: from } },
			{ closedDate: { $lt: to } }
		] } 
	).toArray( function ( err, result ) {
		if ( err ) {
			throw err;
		}
		res.json( result );
	});
});


module.exports = router;
