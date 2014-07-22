var Douban = require('../models/douban.js');

/**
 * Get Home Page
 */

exports.index = function(req, res) {
	res.render('index', function(err, html) {
		if (!err) {
			res.send(html);
		} else {
			console.log('Got error: ' + err);
		}
	});
}

/**
 * Get Douban Photos
 */

exports.crawler = function(req, res) {
	res.send({status: 'true'});

	var douban = new Douban({
		url: req.body.url,
		dirName: req.body.dirName
	});
}