/**
 * room.event
 *
 */

/** 连接成功 */
socket.on('connect', function () {
	$('.room #connecting').fadeOut();
	$('.room #chat').fadeIn();
	room.clearMessage();
	room.findPeople();
});

/** 出错 */
socket.on('error', function (err) {
	console.error(err);
	room.showMessage('系统', err.toString(), 'system');
});

/** 接收到公共消息 */
socket.on('public message', function (from, msg) {
	room.showMessage(from, msg);
});

/** 接收到私人信息 */
socket.on('private message', function (from, msg) {
	room.showMessage(from, msg, 'private');
});

/** 接收到系统信息 */
socket.on('system message', function (msg) {
	room.showMessage('系统', msg, 'system');
});

/** 与其聊天的人离开了 */
socket.on('partner left', function (nickname) {
	room.showMessage('系统', nickname + '离开了。', 'error');
});
