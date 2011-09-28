/**
 * 随机聊天房间
 *
 */
  
var web = require('QuickWeb');
var UtilObject = require('./util');
  
// undefined
var _ = undefined; 
  
 /**
  * 创建一个房间
  *
  * @param {string} room 房间名称
  * @param {socket.io} io socket.io实例
  */
var RandomRoom = module.exports = function (room, io) {
	// 初始化socket.io实例，仅在第一次创建房间时需要设置io参数
	if (typeof io != 'undefined')
		RandomRoom.prototype.io = io;
	var io = this.io;
	
	// 初始化房间公共数据
	var nicknames = this.nicknames = {};
	var maleMember = this.maleMember = [];
	var femaleMember = this.femaleMember = [];
	var onlinesum = this.onlinesum = 0;
	
	// 工具
	var util = this.util = new UtilObject(this);
	
	/** 用户登录处理 */
	var authorizationHandle = function (handshakeData, callback) {
		// 通过客户端的cookie字符串来获取其session数据
		var sessionObject = handshakeData.sessionObject = web.session.getByCookie(handshakeData.headers.cookie);
		var session = sessionObject.data;
		
		// 如果不是登录用户，则自动为其设置一个昵称
		var nickname = session.nickname;
		if (typeof nickname != 'string' || nickname == '')
			nickname = 'guest_' + Math.floor(Math.random() * 1000) + '' + (new Date().getTime() % 86400000);
		session.nickname = nickname;
		
		callback(null, true);
	}
	
	/** 连接处理 */
	var connectionHandle = function (socket) {
		// 获取session
		var session = socket.handshake.sessionObject.data;
		var nickname = session.nickname;
		
		// 保持session，以免session过期
		var hold_session = socket.handshake.sessionObject.hold;
		
		// 设置个人信息
		var user = {
			sex:		(typeof session.sex != 'string' ? 'male' : session.sex),			// 性别
			say:		(typeof session.say != 'string' ? '嘿，你好' : session.say),		// 打招呼
			isFree:		true,				// 是否空闲
			partner:	''					// 与本人聊天的人
		}
		socket.user = user;
		
		// 保存socket.实例
		nicknames[nickname] = socket;
		
		util.come(nickname, user.sex);
		web.log('connection', nickname + ' (' + user.sex + ')', 'debug');
		
		/** 断开来连接 */
		 socket.on('disconnect', function () {
			util.left(nickname);
		 });
		
		/** 查找其他人 */
		socket.on('find partner', function (cb) {
			var p = util.findPeople(nickname, user.sex);
			cb(p);
		});
		
		/** 与某人建立连接 */
		socket.on('chat with', function (partner, cb) {
			// 如果我当前正与某人连接，则先断开
			util.disconnect(nickname);
			
			// 尝试与其对方建立连接
			var ok = util.connect(nickname, partner);
			if (ok) {
				nicknames[partner].emit('private message', nickname, user.say);
				socket.emit('private message', partner, nicknames[partner].user.say);
			}
			cb(ok);
		});
		
		/** 关闭当前连接，等待其他人连接 */
		socket.on('close chat', function (cb) {
			util.disconnect(nickname);
			cb(true);
		});
		
		/** 发送私信 */
		socket.on('private message', function (msg, cb) {
			var partner = nicknames[socket.user.partner];
			if (typeof partner != 'undefined') {
				partner.emit('private message', nickname, msg);
				cb(true);
			}
			else
				cb(false);
		});
	}
	
	
	/* 注册聊天室 */
	if (typeof room == 'undefined')
		room = '';
	io.set('authorization', authorizationHandle);
	io.of('/' + room).on('connection', connectionHandle);
}
