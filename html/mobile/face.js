/**
 * 选择表情
 *
 */
 
var face = {}

/** 显示标签选择页面 */
face.show = function () {
	$.mobile.changePage('#face-list', 'none');
}

// 初始化表情选择窗口
face.init = function () {
	var html = '';
	for (var i = 1; i <= 52; i++)
		html += '<img src="face/b/' + i + '.gif" tag="b/' + i + '" class="face-img">';
	$('#face-div').html(html);
	
	/** 选择表情 */
	$('.face-img').click(function () {
		$m = $('#message');
		$m.val($m.val() + '[!' + $(this).attr('tag') + ']');
		$.mobile.changePage('#chat', 'none');
	});
}
face.init();