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
function Paddle(x, speed, width, height, score_df, scorebox_id, namebox_id) {
	//default values (by me)
	this.x_df;
	this.y_df = 0;
	this.speed_df = 2.0;
	this.height_df = 40;
	this.width_df = 7;

	this.dy = 0;
	this.speed = speed;
	this.height = height;
	this.width = width;

	//From upper left corner
	this.y = (cvs.height/2)-(this.height/2);
	this.x = x;
	//Settings method
	this.set = paddleSet;

	this.misses = 0;

	this.score = score_df
	this.scorebox = document.getElementById(scorebox_id);

	this.name = new String();
	this.namebox = document.getElementById(namebox_id);
}

function paddleSet(paddle_settings) {
	if(typeof paddle_settings[0] != "undefined") {
		this.height = convertInput(paddle_settings[0].value, this.height_df);
	}
	this.score = 0;
	this.misses = 0;
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

	//From upper left corner
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
var then;

var game_speed=5;

//CANVAS ELEMENTS
var cvs = document.getElementById("game_area");
var ctx = cvs.getContext("2d");
//Creates paddles
var p1 = new Paddle(5, 2.0, 7, 40, 0, "player1-score", "player1-name");
var p2 = new Paddle(cvs.width-7-5, 2.0, 7, 40, 0, "player2-score", "player2-name");
//Creates the ball
var ball = new BallConstructor(cvs.height/2, cvs.width/2, 0.8, 1.1, 10, 10, 0.0000000000001);
/*
p1 = Paddle 1, p2 = paddle 2, but also refer to the players
.x and .y mean x or y position of that element
.dx and .dy mean acceleration of that element
*/

function playerName() {
	var player1_name = null;
	var player2_name = null;
	while(!player1_name) {
		player1_name = prompt("What is player 1's name?");
		if(player1_name.length > 25) {alert("Sorry, your name was too long");player1_name=null;}
	}
	p1.namebox.innerHTML = player1_name+":";
	p1.name = player1_name;

	while(!player2_name) {
		player2_name = prompt("What is player 2's name?");
		if(player2_name.length > 25) {alert("Sorry, your name was too long");player2_name=null;}
	}
	p2.namebox.innerHTML = player2_name+":";
	p2.name = player2_name;
}

//General Event Handlers: Clears default value if clicked
function createClickHandlers() {
	var text_boxes = document.querySelectorAll("input[type=text]");
	for(var i=0; i<text_boxes.length; i++) {
		text_boxes[i].onclick = function() {
			if(typeof this!="undefined") {
				this.value="";
			}
		};
	}
}

//SETTING UP A NEW GAME:
function newGame() {
	//settings from form
	ball_settings = document.getElementsByName("ball_settings");
	paddle1_settings = document.getElementsByName("paddle1_settings");
	basic_settings = document.getElementsByName("basic_settings");
	
	new_name = basic_settings[0].checked;
	
	//reset ball position
	ball.x = ball.spawn_x;
	ball.y = ball.spawn_y;

	//set paddle settings
	p1.set(paddle1_settings);

	if(advanced) {
		p2.set(document.getElementsByName("paddle2_settings"));

		ball.dx = convertInput(ball_settings[0].value, ball.dx_df);
		ball.dy = convertInput(ball_settings[1].value, ball.dy_df);
	}
	else {
		//Changes paddle 2 in the same way as paddle 1
		p2.set(document.getElementsByName("paddle1_settings"));

		//Analyzes user ball speed multiplier
		ball.dx = convertInput(ball_settings[0].value*ball.dx_df, ball.dx_df);
		ball.dy = convertInput(ball_settings[0].value*ball.dy_df, ball.dy_df);
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
	var advanced_settings = document.getElementById("advanced_settings");

	var p2_length = document.createElement("input");
	p2_length.setAttribute("type", "text");
	p2_length.setAttribute("value", "40");
	p2_length.setAttribute("placeholder", "Paddle 2 Length");
	p2_length.setAttribute("name", "paddle2_settings");
	var p2_length_span = document.createElement("span");
	p2_length_span.setAttribute("title", "How long Paddle 2 is");
	p2_length_span.innerHTML = "Paddle 2 Length: ";

	//GOAL: ADVANCED BALL SETTINGS

	var linebreak = document.createElement("br");

	if(advanced) {
		document.getElementById("paddle_length").innerHTML = "Paddle 1 Length: ";
		
		advanced_settings.appendChild(linebreak.cloneNode(false));
		advanced_settings.appendChild(p2_length_span);
		advanced_settings.appendChild(p2_length);
	}

	else {
		document.getElementById("paddle_length").innerHTML = "Paddle Length: ";
		while(advanced_settings.firstChild) {
			advanced_settings.removeChild(advanced_settings.firstChild);
		}
	}
	createClickHandlers();
	return false;
}

function pause() {
	paused=true;
	return; 
}

function unPause() {
	paused=false;
	then = new Date().getTime();
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
	ball_settings[0].value = 1;
	paddle1_settings[0].value = p1.height_df;

	if(advanced) {
		//GOAL: ADVANCED BALL SETTINGS
		// ball_settings[0].value = ball.dx_df;
		// ball_settings[1].value = ball.dy_df;

		paddle2_settings = document.getElementsByName("paddle2_settings");
		paddle2_settings[0].value = p2.height_df;
	}
	return false;
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
	ball.y += parseFloat(ball.dy);
	//makes sure paddle doesn't go off screen
	p1.y = Math.min(Math.max(p1.y+p1.dy, 0), cvs.height-p1.height);
	p2.y = Math.min(Math.max(p2.y+p2.dy, 0), cvs.height-p2.height);
	
	var now = new Date().getTime();
	var delta = (now - then)/1000;
	collisionHandler();
	if(ball.dx<0){
		ball.dx-=ball.inc;
	}
	else {
		ball.dx+=ball.inc;
	}
	paint();
	then = now;
	if(!paused){
		setTimeout('gameTick()', game_speed+delta);
	}
	else {return false;}
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
	ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
	ctx.fillRect(p2.x, p2.y, p2.width, p2.height);

	//draws ball
	ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function collisionHandler() {
	var offset = Math.floor(Math.random()*cvs.width/10);
	
	//range means the x is in correct position
	//hit means it just hit the paddle
	var p1_hit = (ball.x - (p1.x+p1.width) == 0) ? true:false;
	var p2_hit = (ball.x+ball.width - p2.x == 0) ? true:false;
	var p1_range = (ball.x < p1.x+p1.width) ? true:false;
	var p2_range = (ball.x+ball.width > p2.x) ? true:false;

	//coll = collision => they hit y-wise
	var p1_coll = (ball.y >= p1.y && ball.y+ball.height<= p1.y+p1.height) ? true:false;
	var p2_coll = (ball.y >= p2.y && ball.y+ball.height<= p2.y+p2.height) ? true:false;
	//bounces the ball off the paddle or wall
	if(ball.y > cvs.height || ball.y<0) {
		ball.dy *= -1;
	}
	//if ball goes out of bounds, gives pts and respawns
	else if(ball.x > cvs.width) {
 		p1.score += 1;
 		p2.misses = parseInt(p2.misses)+1;
		updateScore();

		//makes the serve distance longer, randomizes spawn
 		ball.x = ball.spawn_x-offset;
 		ball.y = ball.spawn_y;

 		if(p2.misses>=3) {
 			console.log("Wow! "+p2.name+" sucks!");
			ball.dx*=-1;
			ball.x = ball.spawn_x+offset;
		}
	}
 	else if(ball.x < 1) {
    	p2.score += 1;
    	p1.misses = parseInt(p1.misses)+1;
		updateScore();
		
		//makes the serve distance longer
		ball.x = ball.spawn_x+offset;
		ball.y = ball.spawn_y;
   
		//after 3 consecutive misses, spawns in other direction
		if(p1.misses>=3) {
			console.log("Wow! "+p1.name+" sucks!");
			ball.dx*=-1;
			ball.x = ball.spawn_x-offset;
		}
	}
	//Direct hit on p1
	else if(p1_hit && p1_coll) {
		console.log("Hit");
		ball.dx *= -1;
		p1.misses = 0;
	}
	//Direct hit on p2
	else if(p2_hit && p2_coll) {
		console.log("Hit");
		ball.dx *= -1;
		p2.misses = 0;
	}
	//Sketchy hit on p1
	else if(p1_range && p1_coll) {
		console.log("That was a close one for "+ p1.name+"!");
		ball.dx *= -1;
	}
	//Sketchy hit on p2
	else if(p2_range && p2_coll) {
		console.log("That was a close one for "+p2.name+"!");
		ball.dx *= -1;
	}
}

//STARTS GAME
paint();
createClickHandlers();
playerName();
newGame();

//GAME INPUT RESPONSE
//changes paddle speeds according to key presses
document.onkeydown = function(e) {
	if(e.keyCode == 83) {
		p1.dy = parseFloat(p1.speed);
    }
    if(e.keyCode == 87) {
		p1.dy = parseFloat(-p1.speed);
    }
	if(e.keyCode == 40) {
		//stops scrolling of page
		e.preventDefault();
		p2.dy = parseFloat(p2.speed);
    }
    if(e.keyCode == 38) {
		//stops scrolling of page
		e.preventDefault();
		p2.dy = parseFloat(-p2.speed);
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