/**
 * 聊天室服务
 *
 */

var web = require('QuickWeb'); 
 
/**
 * 初始化
 *
 * @param {RandomRoom} room 聊天室实例
 */
var util = module.exports = function (room) {
	this.room = room;
}

/**
 * 检查昵称是否被占用
 *
 * @param {string} nickname 昵称
 * @return {bool}
 */
util.prototype.nicknameIsUsed = function (nickname) {
	var nicknames = this.room.nicknames;		// 所有socket连接实例
	
	for (var i in nicknames)
		if (i == nickname)
			return true;
	return false;
}
	
/**
 * 查找一个空闲的人
 *
 * @param {string} nickname 本人昵称
 * @param {string} sex 本人性别：male | female
 * @return {string} 返回false表示没有找到
 */
util.prototype.findPeople = function (nickname, sex) {
	var nicknames = this.room.nicknames;			// 所有socket连接实例
	var maleMember = this.room.maleMember;			// 男空闲成员列表
	var femaleMember = this.room.femaleMember;		// 女空闲成员列表
	web.log('findPeople', 'male: ' + maleMember, 'debug');
	web.log('findPeople', 'female: ' + femaleMember, 'debug');
	web.log('findPeople', nickname, 'debug');
	
	// 根据本人性别，优先查找异性
	var ms = [];
	if (sex == 'female')
		ms = ms.concat(maleMember, femaleMember);
	else
		ms = ms.concat(femaleMember, maleMember);
	// 查找空闲的人
	for (var i = 0; i < ms.length; i++) {
		var n = ms[i];
		if (n == nickname)
			continue;
		if (nicknames[n].user.isFree) {
			web.log('findPeople', '查找到[' + n + ']', 'debug');
			return n;
		}
	}
	web.log('findPeople', '没有找到空闲的人', 'debug');
	return false;
}

/**
 * 进入
 *
 * @param {string} nickname 昵称
 * @param {string} sex 性别
 */
util.prototype.come = function (nickname, sex) {
	var nicknames = this.room.nicknames;			// 所有socket连接实例
	var maleMember = this.room.maleMember;			// 男空闲成员列表
	var femaleMember = this.room.femaleMember;		// 女空闲成员列表
	
	// 在线成员总数
	this.room.onlinesum++;
	
	// 加到男女成员列表
	this.addToMemberList(nickname, sex);
}
	
/**
 * 离开了
 *
 * @param {string} nickname 本人昵称
 */
util.prototype.left = function (nickname) {
	var nicknames = this.room.nicknames;			// 所有socket连接实例
	
	// 在线成员总数
	this.room.onlinesum--;	
	
	// 从男女成员列表中删除
	this.removeFromMemberList(nickname);
	
	// 删除socket实例
	var n = nicknames[nickname];
	if (typeof n != 'undefined') {
		// 通知与其聊天的人
		var w = nicknames[n.user.partner];
		if (typeof w != 'undefined')
			w.emit('partner left', nickname);
		delete nicknames[nickname];
		// 取消连接
		this.disconnect(n.user.partner);
	}
	
	web.log('peopleLeft', '[' + nickname + ']离开了', 'debug');
}
	
/**
 * 将某人从空闲成员列表中删除
 *
 * @param {string} nickname 昵称
 */
util.prototype.removeFromMemberList = function (nickname) {
	var maleMember = this.room.maleMember;			// 男空闲成员列表
	var femaleMember = this.room.femaleMember;		// 女空闲成员列表
	
	// 删除男空闲成员列表
	for (var i = 0; i < maleMember.length; i++)
		if (maleMember[i] == nickname) {
			maleMember.splice(i, 1);
		}
	// 删除女空闲成员列表
	for (var i = 0; i < femaleMember.length; i++)
		if (femaleMember[i] == nickname) {
			femaleMember.splice(i, 1);
		}
	
	web.log('removeFromMemberList', maleMember, 'debug');
	web.log('removeFromMemberList', femaleMember, 'debug');
}

/**
 * 添加到空闲成员列表
 *
 * @param {string} nickname 昵称
 * @param {string} sex
 */
util.prototype.addToMemberList = function (nickname, sex) {
	var maleMember = this.room.maleMember;			// 男空闲成员列表
	var femaleMember = this.room.femaleMember;		// 女空闲成员列表
	
	this.removeFromMemberList(nickname);
	if (sex == 'male')
		maleMember.push(nickname);
	else
		femaleMember.push(nickname);
}
	
/**
 * 两人建立连接
 *
 * @param {string} n1 昵称1
 * @param {string} n2 昵称2
 * @return {bool}
 */
util.prototype.connect = function (n1, n2) {
	var nicknames = this.room.nicknames;		// 所有socket连接实例
	
	// 获取双方的socket实例
	var s1 = nicknames[n1];
	var s2 = nicknames[n2];
	// 如果有人不存在，则失败
	if (typeof s1 == 'undefined'){
		web.log('makePartner', '获取[' + n1 + ']的socket实例出错', 'debug');
		return false;
	}
	if (typeof s2 == 'undefined'){
		web.log('makePartner', '获取[' + n2 + ']的socket实例出错', 'debug');
		return false;
	}
	
	// 如果有人没空，则失败
	if (!s1.user.isFree) {
		web.log('makePartner', '[' + n1 + ']没空', 'debug');
		return false;
	}
	if (!s2.user.isFree) {
		web.log('makePartner', '[' + n2 + ']没空', 'debug');
		return false;
	}
	
	// 开始建立连接
	// 互相设置partner
	s1.user.partner = n2;
	s2.user.partner = n1;
	// 设置空闲状态
	s1.user.isFree = false;
	s2.user.isFree = false;
	// 从空闲成员列表中删除
	this.removeFromMemberList(n1);
	this.removeFromMemberList(n2);
	
	web.log('makePartner', '[' + n1 + ']与[' + n2 + ']建立连接', 'debug');
	return true;
}

/**
 * 取消连接
 *
 * @param {string} nickname
 */
util.prototype.disconnect = function (nickname) {
	var nicknames = this.room.nicknames;		// 所有socket连接实例
	
	var n = nicknames[nickname];
	if (typeof n == 'undefined') {
		web.log('disconnect', '[' + nickname + ']不存在', 'debug');
		return false;
	}
	
	// 通知与其聊天的人
	var partner = nicknames[n.user.partner];
	if (typeof partner != 'undefined') {
		partner.user.partner = '';
		this.disconnect(n.user.partner);
		partner.emit('partner left', nickname);
	}
	
	// 设置为空闲
	n.user.partner = '';
	n.user.isFree = true;
	
	// 添加到男女空闲成员列表
	this.addToMemberList(nickname, n.user.sex);
		
	return true;
}
