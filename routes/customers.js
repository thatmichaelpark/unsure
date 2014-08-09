var express = require('express');
var router = express.Router();

/* GET customers listing. */
/*
 * GET customers.
 */
router.get('/all', function(req, res) {
	var db = req.db;
	db.collection('customers').find().toArray(function (err, items) {
		res.json(items);
	});
});

router.get('/bycustno/:custNo', function(req, res) {
	var db = req.db;
	db.collection('customers').findOne( { 'custNo': Number(req.params.custNo) }, function ( err, result ) {
		if ( err ) {
			console.log( err );
		} else {
			res.json( result );
		}
	});
});

/*
 * POST to add customer.
 */
router.post('/addcustomer', function(req, res) {
    var db = req.db;
	console.log('add customer: ' + req.body);;;
    db.collection('customers').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * PUT to update customer.
 */
router.put('/update/:id', function( req, res ) {
	var db = req.db;
	var customerToUpdate = req.params.id;
	delete req.body._id;
	db.collection( 'customers' ).updateById( customerToUpdate, req.body, function ( err, result ) {
		res.send( err === null ? { msg: '' } : { msg: err } );
	});
});


router.get('/nextCustNo', function(req, res) {
	var db = req.db;
	db.collection('nominalNumbers').findOne( { type: 'cust' }, function(err, result) {
		if (err) throw err;
		db.collection('nominalNumbers').update( { type: 'cust' }, { '$inc': { no: 1 } }, function ( err ) {
			if ( err ) {
				throw err;
			}
			res.json( result.no );
		});
	});
});

module.exports = router;
