<?php
/*
Plugin Name: My Image Gallery
Description: Allows users to easily add their social media links using a shortcode.
Version: 1.0
* License: GPLv2 or later
Author: Habib Ali
*/

//only allow to access properly from admin side to secure the data
if (!defined('ABSPATH')) {
    die("You are not eligible to access the resources."); // Exit if accessed directly
} else {
    echo "welcome";
}