$(function () {
	// 选择性别
	$('.select-sex img').click(function ()  {
		$('.select-sex img').removeClass('selected');
		$(this).addClass('selected');
	});

	// 进入
	$('#come').click(function () {
		var nickname = $('#nickname').val().trim();					// 昵称
		var say = $('#say').val().trim();								// 打招呼内容
		var sex = $('.select-sex .selected').attr('title').trim();	// 性别
		window.location = '/mobile?n=' + nickname + '&s=' + sex + '&say=' + say;
	});
});