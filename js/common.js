$(function() {
	$(window).on('load', function(event) {
		popupOpen();
		wrapWindowByMask();
		generateBarGraph('#dashboard-stats');
	  });
	
	function maskImgs() {
		//$('.img-wrapper img').imagesLoaded({}, function() {
		$.each($('.img-wrapper img'), function(index, img) {
			var src = $(img).attr('src');
			var parent = $(img).parent();
			parent
				.css('background', 'url(' + src + ') no-repeat center center')
				.css('background-size', 'cover');
			$(img).remove();
		});
		//});
	}
	var preview = {
		init: function() {
			preview.setPreviewImg();
			preview.listenInput();
		},
		setPreviewImg: function(fileInput) {
			var path = $(fileInput).val();
			var uploadText = $(fileInput).siblings('.file-upload-text');
			if (!path) {
				$(uploadText).val('');
			} else {
				path = path.replace(/^C:\\fakepath\\/, "");
				$(uploadText).val('Try with other face');
				preview.showPreview(fileInput, path, uploadText);
			}
		},
		showPreview: function(fileInput, path, uploadText) {
			var file = $(fileInput)[0].files;
			if (file && file[0]) {
				var reader = new FileReader();
				reader.onload = function(e) {
					var previewImg = $(fileInput).parents('.file-upload-wrapper').siblings('.preview');
					var img = $(previewImg).find('img');
					if (img.length == 0) {
						$(previewImg).html('<img src="' + e.target.result + '" alt=""/>');
					} else {
						img.attr('src', e.target.result);
					}
					//uploadText.val(path);
					uploadText.val('Try with other face');
					maskImgs();
				}
				reader.onloadstart = function() {
					$(uploadText).val('uploading..');
				}
				reader.readAsDataURL(file[0]);
			}
		},
		listenInput: function() {
			$('.file-upload-native').on('change', function() {
				preview.setPreviewImg(this);
			});
		}
	};
	preview.init();
	
});

function wrapWindowByMask() {
	//화면의 높이와 너비를 구한다.
	var maskHeight = $(document).height(); 
	var maskWidth = $(window).width();     

	//마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
	$('#mask').css({
		'width' : maskWidth,
		'height' : maskHeight
	});

	//애니메이션 효과
	//$('#mask').fadeIn(1000);      
	$('#mask').fadeTo("slow", 0.5);
}

function popupOpen() {
	$('.layerpop').css("position", "absolute");
	//영역 가운에데 레이어를 뛰우기 위해 위치 계산 
	$('.layerpop').css("top",(($(window).height() - $('.layerpop').outerHeight()) / 2) + $(window).scrollTop());
	$('.layerpop').css("left",(($(window).width() - $('.layerpop').outerWidth()) / 2) + $(window).scrollLeft());
	$('#layerbox').show();
}

function popupClose(gender) {
	$('#layerbox').fadeOut(500);
	$('#mask').hide();
	if(gender == 'boy') {
		URL = "https://teachablemachine.withgoogle.com/models/Qenjz9htB/";
	} else {
		URL = "https://teachablemachine.withgoogle.com/models/dZHQ0tepM/";
	}
}

function readURL(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function(e) {
      $('.image-upload-wrap').hide();

      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();
      $('.image-title').html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);
	init().then(() => {
		predict();
	});
  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
		$('.image-upload-wrap').addClass('image-dropping');
	});
	$('.image-upload-wrap').bind('dragleave', function () {
		$('.image-upload-wrap').removeClass('image-dropping');
});

function generateBarGraph(wrapper) {
	// Set Up Values Array
	var values = [];

	// Get Values and save to Array
	$(wrapper + ' .bar').each(function(index, el) {
	  values.push($(this).data('value'));
	});

	// Get Max Value From Array
	// var max_value = Math.max.apply(Math, values);
	var max_value = 100;

	// Set width of bar to percent of max value
	$(wrapper + ' .bar').each(function(index, el) {
	  var bar = $(this),
		  value = bar.data('value'),
		  percent = Math.ceil((value / max_value) * 100);

	  // Set Width & Add Class
	  bar.width(percent + '%');
	  bar.addClass('in');
	});
}