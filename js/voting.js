function votemeaddvote(postId) {
    jQuery.ajax({

	    type: 'POST',
	    url: votemeajax.ajaxurl,
	    data: {
		    action: 'voteme_addvote',
		    postid: postId
		},
 
		success:function(data, textStatus, XMLHttpRequest){
		    jQuery( 'span[data-postid=' + postId + ']' ).text( data );
		    jQuery('a[data-role=vote-me]')
		    .unbind('click.voteme')
		    .attr('data-role', 'remove-vote')
		    .bind('click.removevote', function(e){
		    	e.preventDefault();
		    	removeVoteHandler( jQuery(this).data('postid') );
		    })
		    .html('Remove Vote');
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

function removeVoteHandler( postId ){
	"use strict";

	jQuery.ajax({

	    type: 'POST',
	    url: votemeajax.ajaxurl,
	    data: {
		    action: 'voteme_removevote',
		    postid: postId
		},
 
		success:function(data, textStatus, XMLHttpRequest){
		    jQuery( 'span[data-postid=' + postId + ']' ).text( data );
		    jQuery('a[data-role=remove-vote]')
		    .unbind('click.removevote')
		    .data('role', 'vote-me')
		    .bind('click.voteme', function(e){
		    	e.preventDefault();
		    	var postId = jQuery(this).data('postid');
				votemeaddvote( postId );
		    })
		    .html('Vote');
	    },

	    error: function(MLHttpRequest, textStatus, errorThrown){
	        alert(errorThrown);
        }
    });

}

jQuery(document).ready(function($){
	"use strict";

	$('a[data-role=vote-me]').bind('click.voteme', function(e){
		e.preventDefault();
		var postId = $(this).data('postid');
		votemeaddvote( postId );
	});

	$('a[data-role=remove-vote]').bind('click.removevote', function(e){
		e.preventDefault();
		removeVoteHandler( $(this).data('postid') );
	});
});
