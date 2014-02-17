/*
TABLE OF CONTENTS:
1. Constructors for game objects
2. Global variables
3. Functions and event handlers to be called at the start
4. New Game setup
5. Settings and associated functions
6. Game running functions
7. Input receivers
*/

//Constructor for paddles
function paddle(y, speed, width, height, score_df, scorebox_id, namebox_id) {
	//default values (by me)
	this.x_df = 0;
	this.y_df = 0;
	this.speed_df = 2.0;
	this.height_df = 40;
	this.width_df = 7;

	//values set by user if changed
	this.y = y;
	this.dy = 0;
	this.speed = speed;
	this.height = height;
	this.width = width

	this.set = paddleSet;
	this.score = score_df;
	this.scorebox = document.getElementById(scorebox_id);
	this.namebox = document.getElementById(namebox_id);
}

function paddleSet(paddle_settings) {
	if(typeof paddle_settings[0] != "undefined") {
		this.height = convertInput(paddle_settings[0].value, this.height_df);
	}
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
var p1 = new paddle(230, 2.0, 7, 40, 0, "player1-score", "player1-name");
var p2 = new paddle(230, 2.0, 7, 40, 0, "player2-score", "player2-name");

//Constructor for Ball Object
function ballConstructor(spawn_x_df, spawn_y_df, dx_df, dy_df, inc_df) {
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
var ball_miss; //counts how many times the ball has been missed by a particular player

//GLOBAL VARIABLES
var basic_settings;
var ball_settings;
var paddle1_settings;
var paddle2_settings;
var new_name;
var advanced = false; //advanced settings or not


//CANVAS ELEMENTS
var cvs = document.getElementById("game_area");
var ctx = cvs.getContext("2d");
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
	p1.namebox.innerHTML = player1_name+":";
	
	while(!player2_name) {
		player2_name = prompt("What is player 2's name?");
	}
	p2.namebox.innerHTML = player2_name+":";
}

//General Event Handlers: Clears default value if clicked
var text_boxes = document.querySelectorAll("input[type=text]");
for(var i=0; i<text_boxes.length; i++) {
	text_boxes[i].onclick = function() {
		if(typeof text_boxes[i]!="undefined") {
			text_boxes[i].value="";
		}
	}
}

//SETTING UP A NEW GAME:
function newGame() {
	//settings from form
	ball_settings = document.getElementsByName("ball_settings");
	paddle1_settings = document.getElementsByName("paddle1_settings");
	basic_settings = document.getElementsByName("basic_settings");
	
	new_name = basic_settings[0].checked;
	advanced = basic_settings[basic_settings.length-1].checked;
	//TODO Verify input some more (empty input, etc)
	//resets ball
	ball = new ballConstructor(247, 247, 0.8, 1.1, 0.0000000000001);

	//gets input from form
	ball.dx = convertInput(ball_settings[0].value, ball.dx_df);
	
	//set paddle settings
	p1.set(paddle1_settings);
	if(advanced) {
		p2.set(document.getElementsByName("paddle2_settings"));
	}
	else {
		p2.set(document.getElementsByName("paddle1_settings"));
	}
	if(new_name == true) {
		playerName();
	}
	updateScore();
	gameTick();

	return false;
}
//SETTINGS:
//HIDES/REVEALS ADVANCED SETTINGS
function showAdvanced() {
	advanced = !advanced;
	if(advanced) {
		document.getElementById("paddle_length").innerHTML = "Paddle 1 Length:";
		document.createElement("input");
	}
	else {
		document.getElementById("paddle_length").innerHTML = "Paddle Length:";
	}
}

function convertInput(input, default_val) {
	input = parseFloat(input);
	if(input == NaN) {
		return default_val;
	}
	else {
		return input;
	}
}

function resetSettings() {
	ball_settings = document.getElementsByName("ball_settings");
	paddle1_settings = document.getElementsByName("paddle1_settings");
	basic_settings = document.getElementsByName("basic_settings");

	basic_settings[0].checked = false;
	ball_settings[0].value = 0.8;
	paddle1_settings[0].value = 40;
}
function updateScore() {
	if(p1.score==p2.score) {
		p1.scorebox.innerHTML = p1.score;
		p2.scorebox.innerHTML = p2.score;
		return;
	}
	var winning = p1.score>p2.score?true:false;
	if(winning) {
		p1.scorebox.innerHTML = "<highlight>"+p1.score+"</highlight>";
		p2.scorebox.innerHTML = p2.score;
		return;
	}
	else {
		p1.scorebox.innerHTML = p1.score;
		p2.scorebox.innerHTML = "<highlight>"+p2.score+"</highlight>";
		return;
	}
}

//RUNNING GAME
function gameTick() {
	ball.x += parseFloat(ball.dx);
	//Why is ball.dx initially null? Why does ball.x go 247 to 2471e-13.
	ball.y += parseFloat(ball.dy);
	//makes sure paddle doesn't go off screen
	p1.y = Math.min(Math.max(p1.y + p1.dy, 0), 460);
	p2.y = Math.min(Math.max(p2.y + p2.dy, 0), 460);
	
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
 		updateScore(0);
		//makes the serve distance longer, randomizes spawn
 		ball.x = ball.spawn_x-offset;
 		ball.y = ball.spawn_y;
		p2.misses +=1;
	}
 	else if(ball.x < 10) {
    	p2.score += 1;
    	updateScore();
		//makes the serve distance longer
		ball.x = ball.spawn_x+offset;
		ball.y = ball.spawn_y;
		p1.misses += 1;
	}

	if(ball.dx<0){
		ball.dx-=ball.inc;
	}
	else {
		ball.dx+=ball.inc;
	}

	paint();
	setTimeout('gameTick()', 1);
}

//paints screen accordingly
function paint() {
	var width = cvs.width;
	var height = cvs.height;
	//draws background
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);

	ctx.fillStyle = "white";
	//draws paddles
	//subtracts .y from height b/c origin is upper left corner
	ctx.fillRect(10, height-p1.y, p1.width, 40);
	ctx.fillRect(width-10, height-p2.y, p2.width, 40);
	
	//draws ball
	//compensates for ball.x and ball.y being from the center of the ball
	ctx.fillRect((ball.width)/2-ball.x, height-ball.y+(ball.height/2), ball.width, ball.height);
}
paint();
playerName();
newGame();

//GAME INPUT RESPONSE
//changes paddle speeds according to key presses
document.onkeydown = function(e) {
	if(e.keyCode == 83) {
		p1.dy = parseFloat(-p1.speed);
    }
    if(e.keyCode == 87) {
		p1.dy = parseFloat(p1.speed);
    }
	if(e.keyCode == 40) {
		//stops scrolling of page
		e.preventDefault();
		p2.dy = parseFloat(-p2.speed);
    }
    if(e.keyCode == 38) {
		//stops scrolling of page
		e.preventDefault();
		p2.dy = parseFloat(p2.speed);
    }
	return;
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
	return;
}