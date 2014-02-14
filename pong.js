//Constructor for paddles
function paddle(element_id, y_df, dy_df, speed_df, height_df, score_df) {
	this.style = document.getElementById(element_id).style;

	this.y_df = y_df;
	this.dy_df = dy_df;
	this.speed_df = speed_df;
	this.height_df = height_df;

	this.y = y_df;
	this.dy = dy_df;
	this.speed = speed_df;
	this.height = height_df;

	this.set = paddleSet;
	this.score = score_df;
}

function paddleSet(paddle_settings) {
	this.height = convertInput(paddle_settings[0].value, this.height_df);
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
var p1 = new paddle("paddle1", 230, 0, 2.0, 40, 0);
var p2 = new paddle("paddle2", 230, 0, 2.0, 40, 0);

//Constructor for Ball Object
function ballConstructor(spawn_x_df, spawn_y_df, dx_df, dy_df, inc_df) {
	this.style = document.getElementById("ball").style;

	this.spawn_x_df = parseFloat(spawn_x_df);
	this.spawn_y_df = parseFloat(spawn_y_df);
	this.spawn_x = parseFloat(spawn_x_df);
	this.spawn_y = parseFloat(spawn_y_df);

	this.dx_df = parseFloat(dx_df);
	this.dy_df = parseFloat(dy_df);
	this.dx = parseFloat(dx_df);
	this.dy = parseFloat(dy_df);

	this.x = parseFloat(spawn_x_df);
	this.y = parseFloat(spawn_y_df);

	this.inc_df = parseFloat(inc_df);
	this.inc = parseFloat(inc_df);
}

//Creates the ball
var ball = new ballConstructor(247, 247, 0.8, 1.1, 0.0000000000001);
console.log(ball.x - 10);
console.log(ball.y - 10);
console.log(ball.dx - 10);
console.log(ball.dy - 10);

var ball_miss; //counts how many times the ball has been missed by a particular player

//Settings Declared
var ball_settings;
var paddle1_settings;
var paddle2_settings;
var new_name;
var advanced = false; //advanced settings or not

/*
p1 = Paddle 1, p2 = paddle 2
_x and _y mean x or y position of that element
_dx and _dy mean acceleration of that element
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
	if(new_name == true) {
		playerName();
	}
	gameTick();
}

function gameTick() {
	ball.x += ball.dx;
	//Why is ball.dx initially null? Why does ball.x go 247 to 2471e-13.
	ball.y += ball.dy;
	//makes sure paddle doesn't go off screen
	p1.y = Math.min(Math.max(p1.y + p1.dy, 0), 460);
	p2.y = Math.min(Math.max(p2.y + p2.dy, 0), 460);
	
	p1.style.top=p1.y;
	p2.style.top=p2.y;

	ball.style.top = ball.y;
	ball.style.left = ball.x;
	
	var offset = Math.floor(Math.random()*50);

	//bounces the ball off the paddle or wall
	if (ball.y > 489 || ball.y < 1) {
		ball.dy *= -1;
	}
	else if (ball.x >= 472 && ball.y >= p2.y && ball.y <= p2.y + p2.height) {
		ball.dx *= -1;
		p2.misses = 0;
	}
	else if (ball.x <= 16 && ball.y >= p1.y && ball.y <= p1.y + p1.height) {
		ball.dx *= -1;
		p1.misses = 0;
	}
	//if ball goes out of bounds, gives pts and respawns
	else if(ball.x > 490) {
 		p1.score += 1;
		//makes the serve distance longer, randomizes spawn
 		ball.x = ball.spawn_x-offset;
 		ball.y = ball.spawn_y;
		document.getElementById("player1-score").innerHTML = p1.score;
		p2.misses +=1;
	}
 	else if(ball.x < 10) {
    	p2.score += 1;
		//makes the serve distance longer
		ball.x = ball.spawn_x+offset;
		ball.y = ball.spawn_y;
		document.getElementById("player2-score").innerHTML = p2.score;
		p1.misses += 1;
	}

	if(ball.dx<0){
		ball.dx-=ball.inc;
	}
	else {
		ball.dx+=ball.inc;
	}
	setTimeout('gameTick()', 10);
}

playerName();
newGame();

//changes paddle speeds according to key presses
document.onkeydown = function(e) {
	if(e.keyCode == 83) {
		p1.dy = p1.paddle_speed;
    }
    if(e.keyCode == 87) {
		p1.dy = -p1.paddle_speed;
    }
	if(e.keyCode == 40) {
		//stops scrolling of page
		e.preventDefault();
		p2.dy = p2.paddle_speed;
    }
    if(e.keyCode == 38) {
		//stops scrolling of page
		e.preventDefault();
		p2.dy = -p2.paddle_speed;
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