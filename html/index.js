$(function () {
	// ѡ���Ա�
	$('.select-sex img').click(function ()  {
		$('.select-sex img').removeClass('selected');
		$(this).addClass('selected');
	});

	// ����
	$('#come').click(function () {
		var nickname = $('#nickname').val().trim();					// �ǳ�
		var say = $('#say').val().trim();								// ���к�����
		var sex = $('.select-sex .selected').attr('title').trim();	// �Ա�
		window.location = '/mobile?n=' + nickname + '&s=' + sex + '&say=' + say;
	});
});