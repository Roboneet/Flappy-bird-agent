var Transform = require('stream').Transform;
var util = require('util');

var board = require('./board')();
var gameConfig = board.getConfig();

var block = new (require('./block'))(gameConfig);


util.inherits(ProcessMove, Transform)


var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding( 'utf8' );

stdin
.pipe(new ProcessMove())
process.stdout.write('press enter to begin\n');

function moveForward(){
	if(block.next(0))display();
	setTimeout(moveForward,100);
}

function start(){
	moveForward();
}

function ProcessMove(){
	Transform.call(this, {'objectMode': true});
	this.block = block;
	this.moves = 0;
}




ProcessMove.prototype._transform = function(key, encoding, processed){
	// console.log(key)
	if(this.moves == 0)start();
	this.moves++;
	// ctrl-c ( end of text )
	if ( key === '\u0003' ) {
  			
  		process.exit();
  	}
  	// write the key to stdout all normal like
  	var move = 0;
  	if (key == '\u001B\u005B\u0041') { 	// up
  		move = -1;
  		// process.stdout.write(this.moves.toString());
  	}

  	if (key == '\u001B\u005B\u0042') { //down
  		move = 1;
  	}
  	if(this.block.next(move)){
  		display();
  	}

  	processed();
}


function display(){
	var background = gameConfig.trace.slice();
	var col = block.getCol();
	var row = block.getRow();
	background[row-1][col] = "-";
	background[row][col] = "-";
	background[row + 1][col] = "-";
	var screen = background.map((row)=> row.filter((el,column)=> (column >= col && column <= col + 30) ).join('')).join('\n');
	process.stdout.write(screen)
}