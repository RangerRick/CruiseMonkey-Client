(function() {
	'use strict';

	$(document).ready(function() {
		$('[data-toggle=offcanvas]').click(function() {
			if ($('#sidebar').hasClass('active')) {
				$('#sidebar').removeClass('active');
				$('.row-offcanvas').removeClass('active');
			} else {
				$('.row-offcanvas').addClass('active');
				$('#sidebar').addClass('active');
			}
		});
		$('.sidebar-offcanvas').click(function() {
			if ($('#sidebar').hasClass('active')) {
				$('#sidebar').removeClass('active');
				$('.row-offcanvas').removeClass('active');
			}
		});
	});
}());