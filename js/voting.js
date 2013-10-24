function votemeaddvote(postId) {
    jQuery.ajax({

	    type: 'POST',
	    url: votemeajax.ajaxurl,
	    data: {
		    action: 'voteme_addvote',
		    postid: postId
		},
 
		success:function(data, textStatus, XMLHttpRequest){

		    var linkid = '#voteme-' + postId;
		    jQuery(linkid).html('');
		    jQuery(linkid).append(data);
	    },

	    error: function(MLHttpRequest, textStatus, errorThrown){
	        alert(errorThrown);
        }
    });
}

function setcookie() {
	jQuery("#voteme-1").click(function(e) {
		if (jQuery.cookie('the_cookie')) { 
			jQuery.cookie('the_cookie', null) 
		}
		jQuery.cookie('the_cookie', 1, {
			expires: 180, // 6 months
			path: '/',
		});
	});
}

function removecookie() {
	jQuery("#voteme-1").click(function(e) {
		jQuery.removeCookie('the_cookie', {
			path: '/',
		});
	});
}
