/**
 * 选择表情
 *
 */
 
var face = {}

/** 显示标签选择页面 */
face.show = function () {
	$('#face-list').slideToggle();
}

// 初始化表情
face.init = function () {
	var html = '';
	for (var i = 1; i <= 52; i++)
		html += '<img src="face/b/' + i + '.gif" tag="b/' + i + '" class="face-img">';
	$('#face-list').html(html);
	
	/** 选择表情 */
	$('.face-img').click(function () {
		$m = $('#message');
		$m.val($m.val() + '[!' + $(this).attr('tag') + ']');
		$('#face-list').slideUp();
		$(document).scrollTop(0)
	});
}
face.init();