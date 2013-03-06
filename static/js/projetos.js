$(document).ready(function () {
	$('#projeto_thumbnail').awesomeCropper(
		{ width: 200, height: 200 }
	);
});
$(".btn_file").on('click', function() {
   $('.input_file').click();
});
