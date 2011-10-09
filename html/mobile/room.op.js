/**
 * room.op
 *
 */
 
// 命名空间 
if (typeof room != 'object')
	room = {}
 
/** 发送消息 */
room.sendMessage = function () {
	var msg = $('#message').val().trim();
	room.sendPrivateMessage(msg);
}
/** 发送私人信息 */
room.sendPrivateMessage = function (msg) {
	socket.emit('private message', msg, function (ok) {
		if (ok) {
			room.showMessage('我', msg, 'own');
			room.clearInput();
		}
		else {
			room.showMessage('系统', '[!b/4]刚才发送的消息“' + msg + '”不成功！' , 'error');
		}
	});		
}

/** 查找其他人 */
room.findPeople = function () {
	socket.emit('find partner', function (n) {
		if (n == false)
			room.showMessage('系统', '暂时没有找到其他人，请稍候再试。[!b/10]', 'system');
		else {
			room.chatWith(n);
		}
	});
}

/** 与某人连接 */
room.chatWith = function (n) {
	// console.log('准备与"' + n + '"建立连接...');
	socket.emit('chat with', n, function (ok) {
		if (!ok)
			room.showMessage('系统', '与**' + n + '**连接失败！[!b/4]', 'error');
	});
}

/** 断开与当前连接 */
room.closeChat = function () {
	socket.emit('close chat', function (ok) {
		if (!ok)
			room.showMessage('系统', '操作失败！', 'error');
		else
			room.showMessage('系统', 'OK！现在你可以等待别人连接你，或者点[**换人**]按钮主动出击。[!b/10]', 'system');
	});
}

/** 显示一条消息 */
room.showMessage = function (from, msg, type, sex) {
	var from = room.formatMessage(from);
	var msg = room.formatMessage(msg);
	if (!type)
		type = '';
	else
		type = 'type-' + type;
	var html = '\
<div class="line ' + type + '">\
	<div class="message-header">'
	if (typeof sex != 'undefined')
		html += '<img class="sex-icon" src="img/' + sex + '_i.gif">';
	html +='\
		<span class="message-from">' + from + '</span>\
		<span class="message-timestamp">' + time2str() + '</span>\
	</div>\
	<div class="message-text">\
		' + msg + '\
	</div>\
</div>';
	$('#lines').prepend(html);
	$('#lines').get(0).scrollTop = 10000000;
}

/** 清空所有消息 */
room.clearMessage = function () {
	$('#lines .line').remove();
}

/** 清空输入框 */
room.clearInput = function () {
	$('#message').val('');
}

/** 格式化消息 */ 
room.formatMessage = function (html) {
	html = html
		// 过滤HTML标签
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		// 换行
		.replace(/\n/g, '<br>')
		// 网址链接
		.replace(/\[((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)\]/ig, '<a href="$1" target="_blank">$1</a>')
		// 图片
		.replace(/!((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig, '<img src="$1">')
		// 粗体字
		.replace(/[\*]{2}([^\*]+)[\*]{2}/gi, '<b>$1</b>')
		// 表情
		.replace(/\[!([\w\d\-\.\/?\@\%\!\&=\+\~\:\#\;\,]+)\]/gi, '<img src="/face/$1.gif">');
	return html;
}

/** 生成时间文本 */
var time2str = function (now) {
	if (!(now instanceof Date))
		now = new Date();
	var date = new Date(now.getTime() + 8000 * 3600);
	var m = date.getUTCMinutes();
	var s = date.getUTCSeconds();
	var time = date.getUTCHours() + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
	return time;
}
