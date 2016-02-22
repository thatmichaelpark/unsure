/*
	Stuff for accessing user (i.e. staff) info: names, groups, that sort of thing
*/

var express = require('express');
var router = express.Router();

/* GET user listing. */
/*
 * GET users.
 */
router.get('/all', function(req, res) {
	var db = req.db;
	db.collection('users').find().toArray(function (err, items) {
		res.json(items);
	});
});

router.get('/byusername/:userName', function(req, res) {
	var db = req.db;
	db.collection('users').findOne( { 'name': req.params.userName }, function ( err, result ) {
		if ( err ) {
			console.log( err );
		} else {
			res.json( result );
		}
	});
});

/*
 * POST to add user.
 */
router.post('/add', function(req, res) {
    var db = req.db;
    db.collection('users').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * PUT to update user.
 */
router.put('/update/:id', function( req, res ) {
	var db = req.db;
	var userToUpdate = req.params.id;
	delete req.body._id;
	db.collection( 'users' ).updateById( userToUpdate, req.body, function ( err, result ) {
		res.send( err === null ? { msg: '' } : { msg: err } );
	});
});

/*
 * DELETE to delete user.
 */
router.delete('/delete/:id', function( req, res ) {
	var db = req.db;
	db.collection( 'users' ).removeById( req.params.id, req.body, function ( err, result ) {
		res.send( err === null ? { msg: '' } : { msg: err } );
	});
});

module.exports = router;
