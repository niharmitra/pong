/*
This file declares all the variables, as well as their default values
*/

//Default Values for variables
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
var paddle_speed = paddle_speed_df;
var paddle_height = paddle_height_df; //paddle height defined in pixels
var paddle2_height = paddle_height_df;
var paddle2_speed = paddle_speed_df;

//Set up the ball
//Constructor for Ball Object
function ball(element_id, spawn_x_df, spawn_y_df, dx_df, dy_df, inc_df) {
	this.style = document.getElementById(element_id).style;

	this.spawn_x_df = spawn_x_df;
	this.spawn_y_df = spawn_y_df;
	this.spawn_x = spawn_x;
	this.spawn_y = spawn_y;

	this.dx_df = dx_df;
	this.dy_df = dy_df;
	this.dx = dx_df;
	this.dy = dy_df;

	this.x = spawn_x_df;
	this.y = spawn_y_df;

	this.inc_df = inc_df;
	this.inc = inc_df;
}

ball = new ball(247, 247, 0.8, 1.1, 0.0000000000001)
var ball = document.getElementById("ball");
var ball_y = spawn_y;
var ball_dx = ball_dx_df;
var dy = dy_df;
var ball_inc = ball_inc_df; //how much the ball accelerates over time
var ball_miss; //counts how many times the ball has been missed by a particular player

var p1_score = 0;
var p2_score = 0;

//Settings Declared
var ball_settings;
var paddle1_settings;
var paddle2_settings;
var new_name = false;
var advanced = false; //advanced settings or not

/*
p1 = Paddle 1, p2 = paddle 2
_x and _y mean x or y position of that element
_dx and _dy mean acceleration of that element
*/
document.write("<script type='text/javascript' src='pong_variables.js'></script>");

/*
Players names are received.
*/
function playerName() {
	var player1_name = null;
	var player2_name = null;
	while(!player1_name){
		player1_name = prompt("What is player 1's name?");
	}
	document.getElementById("player1-name").innerHTML = player1_name+":";
	
	while(!player2_name){
		player2_name = prompt("What is player 2's name?");
	}
	document.getElementById("player2-name").innerHTML = player2_name+":";
}

function convertInput(input, default_val) {
	input = parseInt(input);
	if(input == NaN) {
		return default_val;
	}
	else {
		return input;
	}
}

function paddleSet(paddle_settings) {

}
function newGame() {
	//gets input from form
	ball_settings = document.getElementsByName("ball_settings");
	ball_dx = ball_settings[0].value;

	paddle1_settings = document.getElementsByName("paddle1_settings");
	paddle_height = paddle1_settings[0].value;

	if(!advanced) {
		paddle2_height = paddle_height;
	}
	else {
		paddle2_settings = document.getElementsByName("paddle2_settings");
		paddle2_height
	}

	p1.style.height = convertInput(paddle_height,paddle_height_df);
	p2.style.height = convertInput(paddle2_height,paddle_height_df);

	if(new_name){
		playerName();
	}
	else {

	}
	gameTick();
}

function gameTick() {
	ball_x += ball_dx;
	ball_y += dy;
	//makes sure paddle doesn't go off screen
	p1_y = Math.min(Math.max(p1_y + p1_dy, 0), 460);
	p2_y = Math.min(Math.max(p2_y + p2_dy, 0), 460);
	
	p1.style.top=p1_y;
	p2.style.top=p2_y;
	ball.style.top=ball_y;
	ball.style.left=ball_x;
	
	var offset = Math.floor(Math.random()*50);


	//bounces the ball off the paddle or wall
	if (ball_y > 489 || ball_y < 1) {
		dy *= -1;
	}
	if (ball_x >= 472 && ball_y >= p2_y && ball_y <= p2_y + 40) {
		ball_dx *= -1;
		ball_miss = 0;
	}
	if (ball_x <= 16 && ball_y >= p1_y && ball_y <= p1_y + 40) {
		ball_dx *= -1;
		ball_miss = 0;
	}
	//if ball goes out of bounds, gives pts and respawns
	if(ball_x > 490) {
 		p1_score += 1;
		//makes the serve distance longer, randomizes spawn
 		ball_x = ball_spawn_x-offset;
 		ball_y = spawn_y;
		document.getElementById("player1-score").innerHTML = p1_score;
		ball_miss +=1;
	}
 	if(ball_x < 10) {
    	p2_score += 1;
		//makes the serve distance longer
		ball_x = ball_spawn_x+offset;
		ball_y = spawn_y;
		document.getElementById("player2-score").innerHTML = p2_score;
		ball_miss += 1;
	}
	(ball_dx<0)? ball_dx-=ball_inc:ball_dx+=ball_inc;
	setTimeout('gameTick()', 5);
}

playerName();
newGame();

document.getElementById("basic_settings").onchange = newGame();

//changes paddle speeds according to key presses
document.onkeydown = function(e) {
	if(e.keyCode == 83) {
		p1_dy = paddle_speed;
    }
    if(e.keyCode == 87) {
		p1_dy = -paddle_speed;
    }
	if(e.keyCode == 40) {
		//stops scrolling of page
		e.preventDefault();
		p2_dy = paddle_speed;
    }
    if(e.keyCode == 38) {
		//stops scrolling of page
		e.preventDefault();
		p2_dy = -paddle_speed;
    }
	return true;
}

document.onkeyup = function(e) {
    if(e.keyCode == 83) {
		p1_dy = 0;
    }
    if(e.keyCode == 87) {
		p1_dy = 0;
    }
    if(e.keyCode == 40) {
		p2_dy = 0;
    }
    if(e.keyCode == 38) {
		p2_dy = 0;
    }
	return true;
}