/*
  snake game for CMPM20 by Brandon Oleksy
  
  Done without brine because of complications with brine code
  Converted majority to plain javascript and finished from there
  
  DIRECTIONS:
  Use arrow keys to move
  Snake will speed up as score increases
  Difficulty curve gets very high very quickly
  Creator high score is 30
*/

//grid variables
var columns = 30;
var rows = 30;

//color choices for boolean comparison
var emptyFill = 0;
var snakeFill = 1;
var foodFill = 2;

//directional choices for boolean comparison
var left = 0;
var up = 1;
var right = 2;
var down = 3;

//ASCII code for arrow keys
var keyLeft = 37;
var keyUp = 38;
var keyRight = 39;
var keyDown = 40;

//objects
var canvas; 
var ctx; 
var keystate; 
var frames; 
var score; 

//speed control
var speed;
var speedCheck;

//datastructure to create snake grid
grid = {
	w: null,  //width of grid
	h: null, //height of grid
	g: null, //grid array

	//function to call that creates snake grid
	init: function(d, c, r) {
		this.w = c;
		this.h = r;
		this.g = [];
		
		for (var x=0; x < c; x++) {
			this.g.push([]);
			for (var y=0; y < r; y++) {
				this.g[x].push(d);
			}
		}
	},

	//creates values for cells in grid
	set: function(val, x, y) {
		this.g[x][y] = val;
	},

	//gets values of the cell at point in grid
	get: function(x, y) {
		return this.g[x][y];
	}
	
}

//snake as queue object to keep trake of current snake positions
snake = {
	direction: null, //direction #
	last: null, //keeps track of lat element in queue
	q: null, //queue to hold snake

	//snake starting position
	init: function(d, x, y) {
		this.direction = d;
		this.q = [];
		this.insert(x, y);
	},

	//makes snake longer
	insert: function(x, y) {
	
		//adds element to the end of snake
		this.q.unshift({x:x, y:y});
	
		this.last = this.q[0];
	},

	//removes top of snake for movement
	remove: function() {
		return this.q.pop();
	}
	
};

//runs game
main();

//randomly sets position for food
function setFood() {
	var empty = [];
	
	//finds all empty cells so not to collide with snake
	for (var x=0; x < grid.w; x++) {
		for (var y=0; y < grid.h; y++) {
			if (grid.get(x, y) == emptyFill) {
				empty.push({x:x, y:y});
			}
		}
	}
	
	//puts food in random cell
	var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
	grid.set(foodFill, randpos.x, randpos.y);
}

//initial game position
function main() {
	//create game canvas
	canvas = document.createElement("canvas");
	canvas.width = columns*10;
	canvas.height = rows*10;
	
	//make sure canvas is 2D
	ctx = canvas.getContext("2d");
	
	//add canvas to world
	document.body.appendChild(canvas);
	
	//score display
	ctx.font = "18px Times New Roman";
	
	//frame count initialized
	frames = 0;
	keystate = {};
	
	//keeps track of input from user
	document.addEventListener("keydown", function(evt) {keystate[evt.keyCode] = true;});
	document.addEventListener("keyup", function(evt) {delete keystate[evt.keyCode];}); // <-- forgot first semicolon here. drove me crazy for hours

	//initialize game
	init();
	
	//loop game
	loop();
}

//resets and initializes game objects in beginning and after death
function init() {
	score = 0;
	speed = 10;
    speedCheck = 1;
	grid.init(emptyFill, columns, rows);
	var snakePos = {x:Math.floor(columns/2), y:rows-1};
	snake.init(up, snakePos.x, snakePos.y);
	grid.set(snakeFill, snakePos.x, snakePos.y);
	setFood();
}

//update and renders game
function loop() {
	update();
	draw();
	
	//calls loop when canvas is ready to be drawn again
	window.requestAnimationFrame(loop, canvas);
}

//updates the game state
function update() {
	frames++;

//changes snake direction
//However, cannot turn-around when opposite key of previous keypressed is pressed
	if (keystate[keyLeft] && snake.direction != right) {
		snake.direction = left;
	}
	if (keystate[keyUp] && snake.direction != down) {
		snake.direction = up;
	}
	if (keystate[keyRight] && snake.direction != left) {
		snake.direction = right;
	}
	if (keystate[keyDown] && snake.direction != up) {
		snake.direction = down;
	}
	
	//updates speed of snake for every 3 points
	if(score%3 == 0 && speed > 2 && speedCheck%2 == 0){
		speed--;
		speedCheck--;
	}
	
	//updates game and speed of snake
	if (frames%speed == 0) {
		
		//pops head from queue
		var snakeX = snake.last.x;
		var snakeY = snake.last.y;

		//moves snake position
		switch (snake.direction) {
			case left:
				snakeX--;
				break;
			case up:
				snakeY--;
				break;
			case right:
				snakeX++;
				break;
			case down:
				snakeY++;
				break;
		}
		
		//checks to see if game over when snake collides with wall
		if (0 > snakeX || snakeX > grid.w-1 || 0 > snakeY || snakeY > grid.h-1 || grid.get(snakeX, snakeY) == snakeFill) {
			return init();
		}
		
		//updates score when collision between food and snake
		if (grid.get(snakeX, snakeY) == foodFill) {
			score++;
			speedCheck++;
			setFood();
		} 
		//if no food collision, tail taken and given new position
		else {
			var tail = snake.remove();
			grid.set(emptyFill, tail.x, tail.y);
		}
		grid.set(snakeFill, snakeX, snakeY);
		snake.insert(snakeX, snakeY);
	}
}

//keeps grid and canvas together
function draw() {
	
	//checks width and height of grid sections
	var tw = canvas.width/grid.w;
	var th = canvas.height/grid.h;
	
	//draws in sections of grid
	for (var x=0; x < grid.w; x++) {
		for (var y=0; y < grid.h; y++) {
		//checks grid section for proper fill
			switch (grid.get(x, y)) {
				case emptyFill:
					ctx.fillStyle = "#ff0000";
					break;
				case snakeFill:
					ctx.fillStyle = "#000000";
					break;
				case foodFill:
					ctx.fillStyle = "#00ff00";
					break;
			}
		ctx.fillRect(x*tw, y*th, tw, th);
		}
	}

	//draws score
	ctx.fillStyle = "#000000";
	ctx.fillText("Score: " + score, 10, canvas.height-10);
}


