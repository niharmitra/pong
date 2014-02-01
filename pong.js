/*
p1 = Paddle 1, p2 = paddle 2
ball = ball
_x and _y mean x or y position of that element
_dx and _dy mean acceleration of that element
*/
document.write("Hi"+"<script type='text/javascript' src='pong_variables.js'></script>");

/*
Players names are received.
*/
var playerName = function() {
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

function newGame() {
	//gets input from form
	ball_settings = document.getElementsByName("ball_settings");
	paddle1_settings = document.getElementsByName("paddle1_settings");

	if(!advanced) {
		paddle2_settings = document.getElementsByName("paddle1_settings");
	}
	else {
		//paddle2_settings = document.getElementsByName("paddle2_settings");
	}

	p1.style.height = paddle_height;
	p1.style.height = paddle_height;
	

	gameTick();
}

function gameTick() {
	ball_x += ball_dx;
	ball_y += ball_dy;
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
		ball_dy *= -1;
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
 		ball_y = ball_spawn_y;
		document.getElementById("player1-score").innerHTML = p1_score;
		ball_miss +=1;
	}
 	if(ball_x < 10) {
    	p2_score += 1;
		//makes the serve distance longer
		ball_x = ball_spawn_x+offset;
		ball_y = ball_spawn_y;
		document.getElementById("player2-score").innerHTML = p2_score;
		ball_miss += 1;
	}
	(ball_dx<0)? ball_dx-=ball_inc:ball_dx+=ball_inc;
	setTimeout('gameTick()', 1);
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