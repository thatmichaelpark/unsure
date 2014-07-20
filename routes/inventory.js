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

module.exports = router;
