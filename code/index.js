/**
 *　首页
 *
 */
 
exports.paths = '/';

exports.get = exports.post = function (server, request, response) {
	var room = global.room;
	
	server.sessionStart(function () {
		var view = {
			nickname:	server.session.nickname,	// 昵称
			say:		server.session.say,			// 打招呼内容
			sex:		server.session.sex,			// 性别
			online:		room.onlinesum,				// 在线人数
			male:		room.maleMember.length,		// 男成员人数
			female:		room.femaleMember.length	// 女成员人数
		}
		response.renderFile('index.html', view, 'text/html');
	});
}