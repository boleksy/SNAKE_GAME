var columns = 26;
var rows = 26;

var empty = 0;
var snake = 1;
var fruit = 2;

var left = 0;
var up = 1;
var right = 2;
var down = 3;

var grid = {
	w: null,	//width of grid
	h: null,	//height of grid
	g: null,	//creates array for grid to exist
	
	init: function(d, column, row){
		this.width = column;
		this.height = row;
		
		this.grid = [];
		for(var x = 0; i < column; x++){
			this.g.push([]);
			for(var y = 0; y < row; y++){
				this.g[x].push(d);
			}
		}
	},
	
	set: function(value, x, y){
		this.g[x][y] = value;
	},
	
	get: function(x, y){
		return this.g[x][y];
	}
};

var snake = {
	
	direction: null,
	last: null,
	q: null,
	
	init: function(direc, x, y){
		this.direction = direc;
		this.q = [];
		this.insert(x, y);
	},
	
	insert: function(x, y){
		this.q.unshift({x:x, y:y});
		this.last = this.q[0];
	},
	
	remove: function(){
		return this.q.pop();
	}
};

function setFood(){
	var empty = [];
	for(var x = 0; x < grid.width; x++){
		for(var y = 0; y < grid.height; y++){
			if(grid.get(x, y) === EMPTY){
				empty.push({x:x, y:y});
			}
		}
	}
	var randomPos = empty[Math.floor(Math.random()*empty.length)];
	grid.set(fruit, randomPos.x, randomPos.y);
}


//objects
var canvas;
var ctx;
var keystate;
var frames;

function main(){
	canvas = document.createElement("canvas");
	canvas.width = column*25;
	canvas.height = rows*25;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	
	frames = 0;
	keystate = {};
	
	init();
	loop();
}

function loop(){
	update();
	draw();
	
	window.requestAnimationFrame(loop, canvas);
}

function init(){
	grid.init(empty, columns, rows);
	
	var snakePos = {x:Math.floor(columns/2), y:rows-1};
	snake.init(up, snakePos.x, snakePos.y);
	grid.set(SNAKE, snakePos.x, snakePos.y);
	
	setFood();
}

function update(){
	frames++;
}

function draw(){
	var tileWidth = canvas.width/grid.width;
	var tileHeight = canvas.height/grid.height;
	
	for(var x = 0; x < grid.width; x++){
		for(var y = 0; y < grid.height; y++){
			switch(grid.get(x, y)){
				case empty:
					ctx.fillStyle = "#fff";
					break;
				case snake:
					ctx.fillStyle = "#0ff";
					break;
				case fruit:
					ctx.fillStyle = "#f00";
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}

}

main();
