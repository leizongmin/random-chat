/**
 * 自定义Session引擎
 *
 */
 
// 连接MongoDB数据库
var CustomSession = require('../config').db.collection('session');

var log = function () { }

/**
 * 注册到QuickWeb
 */
var init = function () {
	// 注册Session处理函数
	QuickWeb.set({
		'session_pull':		session_pull,
		'session_update':	session_update,
		'session_free':		session_free
	});
	// 日志记录器
	log = function (msg, type) {
		web.log('SESSION', msg, type);
	}
}

/** 获取数据 */
var session_pull = function (callback) {
	var self = this;
	// 从数据库中查找指定ID的Session数据
	CustomSession.findOne({_id: self.id}, function (err, d) {
		if (err)
			log(err, 'error');
		if (!d)
			d = {data: {}}
		// 通过SessionObject.fill()来设置Session数据
		self.fill(d.data || {});
		// 通过SessionObject.callback()来调用回调函数及处理结果（可选）
		self.callback(callback, true);
	});
}

/** 更新数据 */
var session_update = function (callback) {
	var self = this;
	// 保存Session数据到数据库中，通过SessionObject.data来获取内存映射中的数据
	CustomSession.save({_id: self.id, data: self.data, timestamp: new Date().getTime()}, function (err) {
		if (err)
			log(err, 'error');
		self.callback(callback, err ? false : true);
	});
}

/** 释放数据 */
var session_free = function (callback) {
	var self = this;
	// 不删除
	self.callback(callback, true);
}

init();