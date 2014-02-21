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
function Paddle(speed, width, height, score_df, scorebox_id, namebox_id) {
	//default values (by me)
	this.x_df = 0;
	this.y_df = 0;
	this.speed_df = 2.0;
	this.height_df = 40;
	this.width_df = 7;

	//values set by user if changed
	this.y = (cvs.height-height)/2;
	console.log(this.y);
	this.dy = 0;
	this.speed = speed;
	this.height = height;
	this.width = width;

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


//Constructor for Ball Object
function BallConstructor(spawn_x, spawn_y, dx, dy, width, height, inc) {
	this.spawn_x_df = 247;
	this.spawn_y_df = 247;
	this.spawn_x = parseFloat(spawn_x);
	this.spawn_y = parseFloat(spawn_y);

	this.dx_df = 0.8;
	this.dy_df = 1.1;
	this.dx = parseFloat(dx);
	this.dy = parseFloat(dy);

	this.x = parseFloat(spawn_x);
	this.y = parseFloat(spawn_y);

	this.width_df = 10;
	this.height_df = 10;
	this.width = parseFloat(width);
	this.height = parseFloat(height);

	this.inc_df = 0.0000000000001;
	this.inc = parseFloat(inc);
}



//GLOBAL VARIABLES
var basic_settings,
	ball_settings,
	paddle1_settings,
	paddle2_settings;
var new_name;
var advanced = false; //advanced settings or not
var paused = false;
var then, now, delta;

var game_speed=10;

//CANVAS ELEMENTS
var cvs = document.getElementById("game_area");
var ctx = cvs.getContext("2d");
//Creates paddles
var p1 = new Paddle(2.0, 7, 40, 0, "player1-score", "player1-name");
var p2 = new Paddle(2.0, 7, 40, 0, "player2-score", "player2-name");
//Creates the ball
var ball = new BallConstructor(cvs.height/2, cvs.width/2, 0.8, 1.1, 10, 10, 0.0000000000001);
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
		if(player1_name.length > 25) {alert("Sorry, your name was too long");player1_name=null;}
	}
	p1.namebox.innerHTML = player1_name+":";
	
	while(!player2_name) {
		player2_name = prompt("What is player 2's name?");
		if(player2_name.length > 25) {alert("Sorry, your name was too long");player2_name=null;}
	}
	p2.namebox.innerHTML = player2_name+":";
}

//General Event Handlers: Clears default value if clicked
var text_boxes = document.querySelectorAll("input[type=text]");

for(var i=0; i<text_boxes.length; i++) {
	text_boxes[i].onclick = function() {
		if(typeof this!="undefined") {
			this.value="";
			console.log("Erased box");
		}
	};
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
	ball = new BallConstructor(cvs.height/2, cvs.width/2, 0.8, 1.1, 10, 10, 0.0000000000001);

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
	then = new Date().getTime();
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

function pause() {
	paused=true;
	return;
}

function unPause() {
	paused=false;
	gameTick();
	return;
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
	p1.y = Math.min(Math.max(p1.y+p1.dy, p1.height), cvs.height);
	p2.y = Math.min(Math.max(p2.y+p2.dy, p2.height), cvs.height);
	
	now = new Date().getTime();
	delta = (now - then)/1000;
	collisionHandler();
	then = now;
	if(ball.dx<0){
		ball.dx-=ball.inc;
	}
	else {
		ball.dx+=ball.inc;
	}

	paint();
	if(!paused){setTimeout('gameTick()', game_speed+delta);}
	else {return;}
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
	ctx.fillRect(p1.width, height-p1.y, p1.width, 40);
	ctx.fillRect(width-2*p2.width, height-p2.y, p2.width, 40);

	//draws ball
	//compensates for ball.x and ball.y being from the center of the ball
	//console.log(ball.height);
	//console.log(ball.width);
	ctx.fillRect(ball.x-(ball.width/2), height-ball.y+(ball.height/2), ball.width, ball.height);
}

function collisionHandler() {
	//TO IMPROVE
	var offset = Math.floor(Math.random()*cvs.width/10);
	
	//bounces the ball off the paddle or wall
	if (ball.y+(ball.height/2) > cvs.height || ball.y-(ball.height/2)<0) {
		ball.dy *= -1;
	}
	if (ball.x >= cvs.width-p2.width && ball.y >= p2.y && ball.y <= p2.y+p2.height) {
		ball.dx *= -1;
		p2.misses = 0;
	}
	if (ball.x <= p1.width && ball.y >= p1.y && ball.y <= p1.y+p1.height) {
		ball.dx *= -1;
		p1.misses = 0;
	}
	//if ball goes out of bounds, gives pts and respawns
	else if(ball.x > cvs.width) {
 		p1.score += 1;
 		updateScore();
		//makes the serve distance longer, randomizes spawn
 		ball.x = ball.spawn_x-offset;
 		ball.y = ball.spawn_y;
		p2.misses +=1;
	}
 	else if(ball.x < 1) {
    	p2.score += 1;
    	updateScore();
		//makes the serve distance longer
		ball.x = ball.spawn_x+offset;
		ball.y = ball.spawn_y;
		p1.misses += 1;
	}
}

//STARTS GAME
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
    if(e.keyCode == 32) {
    	e.preventDefault();
    }
    if(e.keyCode == 80) {
    	if(paused){unPause();}
    	else{pause();}
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
