//Constructor for paddles
function paddle(element_id, y_df, dy_df, speed_df, height_df) {
	this.style = document.getElementById(element_id);

	this.y = y_df;
	this.dy = dy_df;
	this.speed = speed_df;
	this.height = height_df;

	this.set = paddleSet;
}

function paddleSet(paddle_settings) {
	this.height = paddle_settings[0].value;
	// paddle1_settings = document.getElementsByName("paddle1_settings");
	// paddle_height = paddle1_settings[0].value;

	// if(!advanced) {
	// 	paddle2_height = paddle_height;
	// }
	// else {
	// 	paddle2_settings = document.getElementsByName("paddle2_settings");
	// 	paddle2_height
	// }

	// p1.style.height = convertInput(paddle_height,p1.height_df);
	// p2.style.height = convertInput(paddle2_height,p2.height_df);
}

//Creates paddles
var p1 = new paddle("paddle1", 230, 0, 2.0, 40);
var p2 = new paddle("paddle2", 230, 0, 2.0, 40);

//Constructor for Ball Object
function ball(element_id, spawn_x_df, spawn_y_df, dx_df, dy_df, inc_df) {
	//this.style = document.getElementById(element_id).style;

	this.spawn_x_df = spawn_x_df;
	this.spawn_y_df = spawn_y_df;
	this.spawn_x = spawn_x_df;
	this.spawn_y = spawn_y_df;

	this.dx_df = dx_df;
	this.dy_df = dy_df;
	this.dx = dx_df;
	this.dy = dy_df;

	this.x = spawn_x_df;
	this.y = spawn_y_df;

	this.inc_df = inc_df;
	this.inc = inc_df;
}

//Creates the ball
var ball = new ball("ball", 247, 247, 0.8, 1.1, 0.0000000000001);

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
	while(!player1_name) {
		player1_name = prompt("What is player 1's name?");
	}
	document.getElementById("player1-name").innerHTML = player1_name+":";
	
	while(!player2_name) {
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


function newGame() {
	//gets input from form
	ball_settings = document.getElementsByName("ball_settings");
	ball.dx = ball_settings[0].value;

	basic_settings = document.getElementsByName("basic_settings");

	new_name = basic_settings[0].checked;
	if(new_name) {
		playerName();
	}
	else {

	}
	gameTick();
}

function gameTick() {
	ball.x += ball.dx;
	ball.y += ball.dy;
	//makes sure paddle doesn't go off screen
	p1.y = Math.min(Math.max(p1.y + p1.dy, 0), 460);
	p2.y = Math.min(Math.max(p2.y + p2.dy, 0), 460);
	
	p1.style.top=p1.y;
	p2.style.top=p2.y;
	
	var offset = Math.floor(Math.random()*50);

	//bounces the ball off the paddle or wall
	if (ball.y > 489 || ball.y < 1) {
		dy *= -1;
	}
	if (ball.x >= 472 && ball.y >= p2.y && ball.y <= p2.y + 40) {
		ball.dx *= -1;
		ball_miss = 0;
	}
	if (ball.x <= 16 && ball.y >= p1.y && ball.y <= p1.y + 40) {
		ball.dx *= -1;
		ball_miss = 0;
	}
	//if ball goes out of bounds, gives pts and respawns
	if(ball.x > 490) {
 		p1_score += 1;
		//makes the serve distance longer, randomizes spawn
 		ball.x = ball.spawn_x-offset;
 		ball.y = ball.spawn_y;
		document.getElementById("player1-score").innerHTML = p1_score;
		ball_miss +=1;
	}
 	if(ball.x < 10) {
    	p2_score += 1;
		//makes the serve distance longer
		ball.x = ball.spawn_x+offset;
		ball.y = ball.spawn_y;
		document.getElementById("player2-score").innerHTML = p2_score;
		ball_miss += 1;
	}
	(ball.dx<0)? ball.dx-=ball.inc:ball.dx+=ball.inc;
	ball.style.top=ball.y;
	ball.style.left=ball.x;
	setTimeout('gameTick()', 5);
}

playerName();
newGame();

document.getElementById("basic_settings").onchange = newGame();

//changes paddle speeds according to key presses
document.onkeydown = function(e) {
	if(e.keyCode == 83) {
		p1.dy = paddle_speed;
    }
    if(e.keyCode == 87) {
		p1.dy = -paddle_speed;
    }
	if(e.keyCode == 40) {
		//stops scrolling of page
		e.preventDefault();
		p2.dy = paddle_speed;
    }
    if(e.keyCode == 38) {
		//stops scrolling of page
		e.preventDefault();
		p2.dy = -paddle_speed;
    }
	return true;
}

document.onkeyup = function(e) {
    if(e.keyCode == 83) {
		p1.dy = 0;
    }
    if(e.keyCode == 87) {
		p1.dy = 0;
    }
    if(e.keyCode == 40) {
		p2.dy = 0;
    }
    if(e.keyCode == 38) {
		p2.dy = 0;
    }
	return true;
}