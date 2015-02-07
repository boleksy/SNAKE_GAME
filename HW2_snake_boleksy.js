
var columns = 30;
var rows = 30;

var emptyFill = 0;
var snakeFill = 1;
var foodFill = 2;

var LEFT = 0;
var UP = 1;
var RIGHT = 2;
var DOWN = 3;

var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

//objects
var canvas; 
var ctx; 
var keystate; 
var frames; 
var score; 
/**
* Grid datastructor, usefull in games where the game world is
* confined in absolute sized chunks of data or information.
*
* @type {Object}
*/
grid = {
	width: null, /* number, the number of columns */
	height: null, /* number, the number of rows */
	_grid: null, /* Array<any>, data representation */

	//function to call that creates snake grid
	init: function(d, c, r) {
		this.width = c;
		this.height = r;
		this._grid = [];
		
		for (var x=0; x < c; x++) {
			this._grid.push([]);
			for (var y=0; y < r; y++) {
				this._grid[x].push(d);
			}
		}
	},

	//creates values for cells in grid
	set: function(val, x, y) {
		this._grid[x][y] = val;
	},

//gets values of the cell at point in grid
	get: function(x, y) {
		return this._grid[x][y];
	}
	
}

//snake as queue object to keep trake of current snake positions
snake = {
	direction: null, //direction #
	last: null, //keeps track of lat element in queue
	_queue: null, //queue to hold snake

	//snake starting position
	init: function(d, x, y) {
		this.direction = d;
		this._queue = [];
		this.insert(x, y);
	},

	//makes snake longer
	insert: function(x, y) {
	
		//adds element to the end of snake
		this._queue.unshift({x:x, y:y});
	
		this.last = this._queue[0];
	},

	//removes top of snake for movement
	remove: function() {
		return this._queue.pop();
	}
	
};

//runs game
main();

//randomly sets position for food
function setFood() {
	var empty = [];
	
	//finds all empty cells so not to collide with snake
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			if (grid.get(x, y) === emptyFill) {
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
	grid.init(emptyFill, columns, rows);
	var sp = {x:Math.floor(columns/2), y:rows-1};
	snake.init(UP, sp.x, sp.y);
	grid.set(snakeFill, sp.x, sp.y);
	setFood();
}

//update and renders game
function loop() {
	update();
	draw();
	
	//calls loop when canvas is ready to be drawn again
	window.requestAnimationFrame(loop, canvas);
}
/**
* Updates the game logic
*/
function update() {
	var speed = 10;
	frames++;

//changes snake direction
//However, cannot turn-around when opposite key of previous keypressed is pressed
	if (keystate[KEY_LEFT] && snake.direction != RIGHT) {
		snake.direction = LEFT;
	}
	if (keystate[KEY_UP] && snake.direction != DOWN) {
		snake.direction = UP;
	}
	if (keystate[KEY_RIGHT] && snake.direction != LEFT) {
		snake.direction = RIGHT;
	}
	if (keystate[KEY_DOWN] && snake.direction != UP) {
		snake.direction = DOWN;
	}
	
	//updates speed of snake for every 3 points
	if(score%3 == 0 && speed > 2){
		speed--;
	}
	
	//updates game and speed of snake
	if (frames%speed == 0) {
		
		//pops head from queue
		var nx = snake.last.x;
		var ny = snake.last.y;

		//moves snake position
		switch (snake.direction) {
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}
		
		//checks to see if game over when snake collides with wall
		if (0 > nx || nx > grid.width-1 || 0 > ny || ny > grid.height-1 || grid.get(nx, ny) === snakeFill) {
			return init();
		}
		
		//collision for food and snake
		if (grid.get(nx, ny) === foodFill) {
			score++;
			setFood();
		} 
		//if no food collision, tail taken and given new position
		else {
			var tail = snake.remove();
			grid.set(emptyFill, tail.x, tail.y);
		}
		grid.set(snakeFill, nx, ny);
		snake.insert(nx, ny);
	}
}

//keeps grid and canvas together
function draw() {
	
	//checks width and height of grid sections
	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;
	
	//draws in sections of grid
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
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
	ctx.fillStyle = "#000";
	ctx.fillText("Score: " + score, 10, canvas.height-10);
}


