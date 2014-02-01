/*
This file declares all the variables, as well as their default values
*/

//Default Values for variables
var ball_spawn_x_df = 247;
var ball_spawn_y_df = 247;
var ball_dx_df = 0.8;
var ball_dy_df = 1.1;
var ball_inc_df = 0.0000000000001;

var paddle_speed_df = 2.0;
var paddle_height_df = 40;

//Paddles are initialized
var p1 = document.getElementById("paddle1");
var p2 = document.getElementById("paddle2");
//Paddle characteristics
var p1_y = 230; //where it is positioning wise
var p2_y = 230;
var p1_dy = 0;
var p2_dy = 0;
var paddle_speed = 2.paddle_speed_df;
var paddle_height = paddle_height_df; //paddle height defined in pixels

//Set up the ball
var ball_spawn_x = ball_spawn_x_df;
var ball_spawn_y = ball_spawn_y_df;
var ball = document.getElementById("ball");
var ball_x = ball_spawn_x;
var ball_y = ball_spawn_y;
var ball_dx = ball_dx_df;
var ball_dy = ball_dy_df;
var ball_inc = ball_inc_df; //how much the ball accelerates over time
var ball_miss; //counts how many times the ball has been missed by a particular player

var p1_score = 0;
var p2_score = 0;

//Settings Declared
var ball_settings;
var paddle1_settings;
var paddle2_settings;
var advanced = false; //advanced settings or not