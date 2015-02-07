//Make sure that 2D
use2D = true;

//initialize game canvas
initGame("canvas");

//array to be used for snake cells
var snakeArray;

initSnake();

function initSnake(){

	//initial length of snake
	var size = 5;
	
	//start with empty array for snake to be filled
	snakeArray = [];
	
	//creates snake in top left
	for(var i = size - 1; i >= 0; i--){
		snakeArray.push({x: i, y: 0});
	}
		
}

function fillSnake(){
	for(var i = 0; i < snakeArray.length; i++){
		var cell = snakeArray[i];
		fillStyle("green");
		fillRect(cell.x*10, cell.y*10, 10, 10);
		fillStyle("red");
		fillRect(cell.x*10, cell.y*10, 10, 10);
	}
}

fillSnake();