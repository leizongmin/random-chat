/**
 * 随机聊天室
 *
 * @author 老雷<leizongmin@gmail.com>
 * @version 0.1
 */
 
var web = require('QuickWeb');
var io = require('socket.io');
var mustache = require('mustache');
//var Room = require('./lib/room.js');
var RandomRoom = require('./lib/random');
 
 
/* 配置QuickWeb */
var web = require('QuickWeb');
web.set('home_path', './html');				// 网站根目录
web.set('code_path', './code');				// 处理程序目录
web.set('template_path', './html');			// 模板目录
web.set('tmp_path',	'./tmp');				// 临时目录
web.set('session_cookie_maxage', 3600 * 24 * 7);	// Session的Cookie存储时间
// 模板引擎
web.set('render_to_html', function (str, view) {
	console.log(view);
	return mustache.to_html(str, view);
});
// Session引擎
require('./lib/session')(web);
// 监听80端口
var s = web.create(80);


/* 配置socket.io */
io = io.listen(s);
io.set('transports', ['htmlfile', 'xhr-polling', 'jsonp-polling']);
// 注册房间
var room = new RandomRoom('random', io);
global.room = room;

/* 日志输出 */
web.setLogLevel(3);
io.set('log level', 1);