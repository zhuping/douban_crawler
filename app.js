var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');

var app = express();


app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

// 用于设置全局视图选项的对象
app.set('view options', {layout: false});

// 设置静态资源路径
app.use(express.static(__dirname + '/public'));

// 异步请求配置
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api + json'}));

/**
 * 路由配置
 */

app.get('/', routes.index);
app.post('/getDoubanPhoto.html', routes.crawler);


app.listen(3000);
console.log('Server running at localhost:3000');