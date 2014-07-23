var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var request = require('request');

function Douban(config) {
	this.dirName = config.dirName;
	this.url = config.url;
	this.init();
}

Douban.prototype.init = function() {
	var self = this;
	var url = self.url;
	var dir = self.dirName;

	// 统一放在download目录
	fs.exists('./download', function(exists) {
		if (!exists) {
			fs.mkdirSync('download');
		}
	});

	// 创建图片目录
	fs.exists('./download/' + dir, function(exists) {
		if (!exists) {
			fs.mkdirSync('./download/' + dir);
		}
	});

	self.getPhotos(url);
}

Douban.prototype.getPhotos = function(url) {
	var self = this;
	var dir = self.dirName;
	var options = {
		url: url,
		headers: {
			'User-Agent': 'request'
		}
	};

	request(options, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = cheerio.load(body);
			$('.photo_wrap img').each(function() {
				var imgUrl = $(this).attr('src').replace('thumb', 'photo');
				var filename = path.basename(imgUrl);
				var filepath = 'download/' + dir + '/' + filename;
				request(imgUrl).pipe(fs.createWriteStream(filepath).on('error', function(error) {
					console.log(error);
				}));
			});

			// 检查是否有下一页
			var nextUrl = $('.next a').attr('href');
			if (nextUrl) {
				self.getPhotos(nextUrl);
			}
		}
	});
}

module.exports = Douban;