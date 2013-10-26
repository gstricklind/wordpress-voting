<?php 

/*
Plugin Name: Voting for Posts
Plugin URI: http://
Description: Enables voting for posts
Author: 
Version: 0.1
Author URI: http://
*/	



/* Constants */
define('VOTEMESURL', WP_PLUGIN_URL."/".dirname( plugin_basename( __FILE__ ) ) );
define('VOTEMEPATH', WP_PLUGIN_DIR."/".dirname( plugin_basename( __FILE__ ) ) );

/* Scripts */
function voteme_enqueuescripts() {
    wp_enqueue_script('voteme', VOTEMESURL.'/js/voting.js', array('jquery'));
    wp_localize_script( 'voteme', 'votemeajax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
    
    wp_register_script('jquery-cookie', VOTEMESURL . '/js/vendors/jquery-cookie/jquery-cookie.js', array('jquery'));
    wp_enqueue_script('jquery-cookie');
}
add_action('wp_enqueue_scripts', 'voteme_enqueuescripts');


/* Adding vote link to all posts */
function voteme_getvotelink() {
	$votemelink = "";

	$post_ID = get_the_ID();
	$votemecount = get_post_meta($post_ID, '_votemecount', true) != '' ? get_post_meta($post_ID, '_votemecount', true) : '0';
	
	if (isset($_COOKIE['post_' . $post_ID])) {
		//show remove vote link and decrease count by 1 if post has been voted for
		$link = '<a href="#" data-role="remove-vote" data-postid="' . $post_ID . '">' . 'Remove Vote' . '</a>';
	} else {
		$link = '<a href="#" data-role="vote-me" data-postid="' . $post_ID . '">Vote</a>';
	}
	 
	$votemelink = '<div id="vote-me">';
	$votemelink .= '<p><span class="vote-count" data-postid="' . $post_ID . '">' . $votemecount . '</span> vote(s) | ' . $link . '</p>';
	$votemelink .= '</div>';
	 
	return $votemelink;
}


function voteme_printvotelink($content) {
	return $content.voteme_getvotelink();
}
add_filter('the_content', 'voteme_printvotelink');



/* Using AJAX */
function voteme_addvote() {

	/**
	 * Add some kind of check if cookie has already been set? But then, clearing cookies is easy...
	 */

    global $wpdb;
    $post_ID = $_POST['postid'];
    $votemecount = get_post_meta($post_ID, '_votemecount', true) != '' ? get_post_meta($post_ID, '_votemecount', true) : '0';
    $votemecountNew = $votemecount + 1;
    update_post_meta($post_ID, '_votemecount', $votemecountNew);

    # Use PHP instead of the jQuery Cookie library?
    setcookie( 'post_' . $post_ID, '1', time() + 60 * 60 * 24 * 30 * 6, '/' ); # set to 6 months

    # returns the new number of votes
    /**
     * @todo: fix or not?
	 * You can't pass an integer in die http://stackoverflow.com/a/6913336/1370034
	 *
	 * Casting as string
     */
    die( '' . $votemecountNew );
}

 
// creating Ajax call for WordPress
add_action( 'wp_ajax_nopriv_voteme_addvote', 'voteme_addvote' );
add_action( 'wp_ajax_voteme_addvote', 'voteme_addvote' );


function voteme_removevote() {

    global $wpdb;
    $post_ID = $_POST['postid'];
    $votemecount = get_post_meta($post_ID, '_votemecount', true) != '' ? get_post_meta($post_ID, '_votemecount', true) : '0';
    $votemecountNew = $votemecount - 1;
    update_post_meta($post_ID, '_votemecount', $votemecountNew);

    # Use PHP instead of the jQuery Cookie library?
    setcookie( 'post_' . $post_ID, '1', time() - 1000, '/' );

    # returns the new number of votes
    die( '' . $votemecountNew );
}

 
// creating Ajax call for WordPress
add_action( 'wp_ajax_nopriv_voteme_removevote', 'voteme_removevote' );
add_action( 'wp_ajax_voteme_removevote', 'voteme_removevote' );


/* Admin Panel */

//add column
add_filter( 'manage_edit-post_columns', 'voteme_extra_post_columns' );
function voteme_extra_post_columns($columns) {
	$columns['votemecount'] = __( 'Votes' );
	return $columns;
}

//add column data/rows
function voteme_post_column_row($column) {
	if($column != 'votemecount')
		return;

	global $post;
	$post_id = $post->ID;
	$votemecount = get_post_meta($post_id, '_votemecount', true) != '' ? get_post_meta($post_id, '_votemecount', true) : '0';
	echo $votemecount;
}
add_action( 'manage_posts_custom_column', 'voteme_post_column_row', 10, 2 );

//allow sorting of row

//add_filter('manage_edit-post_sortable_columns', 'voteme_post_sortable_columns');
function voteme_post_sortable_columns($columns) {
	$columns['votemecount'] = votemecount;
	return $columns;
}

add_action( 'load-edit.php', 'voteme_post_edit' );
 
function voteme_post_edit() {
    add_filter( 'request', 'voteme_sort_posts' );
}
function voteme_sort_posts( $vars ) {
	if ( isset( $vars['post_type'] ) && 'post' == $vars['post_type'] ) {
    	if ( isset( $vars['orderby'] ) && 'votemecount' == $vars['orderby'] ) {
            $vars = array_merge(
	            $vars,
	            array(
		            'meta_key' => '_votemecount',
		            'orderby' => 'meta_value_num'
	            )
            );
    	}
	}
	return $vars;
}
