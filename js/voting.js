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
		    .filter( '[data-postid=' + postId + ']' )
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
		    .filter( '[data-postid=' + postId + ']' )
		    .unbind('click.removevote')
		    .attr('data-role', 'vote-me')
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
