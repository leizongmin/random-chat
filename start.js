/**
 * 随机聊天室
 *
 * @author 老雷<leizongmin@gmail.com>
 * @version 0.1
 */
 
var web = require('QuickWeb');
var io = require('socket.io');
var mustache = require('mustache');
 //--------------------------------------------------------------------------------
 
 
/* 配置QuickWeb */
web.set({
	'template_path':			'./html',				// 模板目录
	'session_cookie_maxage':	3600 * 24 * 7,			// Session的Cookie存储时间
	'render_to_html':			function (str, view) {		// 模板引擎
		return mustache.to_html(str, view);
	}
});

// 基于MongoDB的Session引擎
require('./lib/session');

// 监听80端口
var s = web.create(80);
//--------------------------------------------------------------------------------


/* 配置socket.io */
io = io.listen(s);
// 设置客户端连接方式，由于NAE中不支持websocket连接，此处只允许xhr-polling, jsonp-polling, htmlfile
io.set('transports', ['xhr-polling', 'jsonp-polling', 'htmlfile']);
// 注册房间
var RandomRoom = require('./lib/random');
var room = new RandomRoom('random', io);
global.room = room;
//--------------------------------------------------------------------------------


/* 日志输出 */
web.setLogLevel(3);
io.set('log level', 1);