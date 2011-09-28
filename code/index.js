/**
 *　首页
 *
 */
 
exports.paths = '/';

exports.get = exports.post = function (server, request, response) {
	server.sessionStart(function () {
		var view = {
			nickname:	server.session.nickname,
			say:		server.session.say,
			sex:		server.session.sex,
			online:		100
		}
		response.renderFile('index.html', view, 'text/html');
	});
}