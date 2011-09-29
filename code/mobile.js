/**
 * 进入随机聊天房间
 *
 */

exports.paths = '/mobile';

exports.get = exports.post = function (server, request, response) {
	var nickname = request.get.n;
	var sex = request.get.s;
	var say = request.get.say;
	
	server.sessionStart(function () {
		// 保存配置信息
		if (typeof nickname != 'undefined')
			server.session.nickname = nickname;
		if (typeof sex != 'undefined')
			server.session.sex = sex;
		if (typeof say != 'undefined')
			server.session.say = say;
		server.sessionUpdate();
		
		// 输出页面
		response.renderFile('mobile/room.html', {}, 'text/html');
	});
}