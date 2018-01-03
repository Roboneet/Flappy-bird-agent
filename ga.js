
module.exports = Population

/**
*
* solutions: 
*	 0 = go straight
*	-1 = go up
*    1 = go down
*
**/



/**
*
*  Population
*  @function log
*  @function start
*  @function run
*  @function fill
*  @function sort
*  @function mate
*  @function evaluate
*  @function generation
*  @function mateTop
*  @function mutate
*  @function kill
*
**/

function Population({
	size=100,
	mutationChance=0.5,
	threashold=100,
	elitism=0.25,
	gameConfig,
	debug=false,
	display=(()=>{})
}={})
{
	this.gameConfig = gameConfig;
	this.elitism = elitism;
	this.size = size;
	this.mutationChance = mutationChance;
	this.threashold = threashold;
	this.debug = debug;
	this.display = display.bind(this);
}	

Population.prototype.log = ()=>{};

Population.prototype.start = function(){
	this.players = [];
	this.generationNo = 0;
	if(this.debug)this.log=console.log;
	this.log('start!');
	this.fill();
	this.run();
}


Population.prototype.run = function({noImprovement=0,lastScore=false} = {}){
	this.log('run...')	
	lastScore = lastScore || this.players[0].score;
	if(noImprovement<this.threashold){
		
		this.generation(noImprovement);
		// console.log(lastScore, this.players[0].score)
		if(lastScore >= this.players[0].score){
			noImprovement++
		}else{
			noImprovement = 0;
		}	

		var __self__ = this;
		setTimeout(function(){
			__self__.run({
				noImprovement,
				"lastScore":__self__.players[0].score
			});
		}, 1);
		return false;
	}else{
		if(lastScore && lastScore > 0){ // okay ! constant +ve score
			this.display(noImprovement);
		}else{  // NOt done yet
			var __self__ = this;
			setTimeout(function(){
				console.log('Starting again');
				__self__.start();
			}, 1)
		}
	}
	
}

Population.prototype.fill = function(){
	this.log('fill...')
	while(this.size > this.players.length){
		if(this.players.length < (this.size*this.elitism)){
			var player = new Player();
			player.random(this.gameConfig.cols - 1);
			this.players.push(player);	
		}else{
			this.mate();
		}
	}
}

Population.prototype.sort = function(){
	this.log('sort...')
	this.players.sort(function(a, b){
		return b.score - a.score;
	})
}

Population.prototype.mate = function(a, b){
	this.log('mate...')
	var player = a || this.players[Math.floor(Math.random()*this.players.length)];
	var opponent = b || player;
	do{
		opponent = this.players[Math.floor(Math.random()*this.players.length)];
	}while(opponent == player);
	this.players = this.players.concat(player.mate(opponent, this.gameConfig));	
}

Population.prototype.evaluate = function(){
	this.log('evalute...')
	var scope = this;
	this.players.forEach(p=>(p.fitness(scope.gameConfig)));
}

Population.prototype.generation = function(noImprovement){
	this.log('genertation...', this.generationNo)
	this.evaluate();
	this.sort();
	if((this.generationNo % 10) == 0){
		this.display(noImprovement);
	}
	this.kill();
	this.mateTop();
	this.fill();
	this.mutate();
	this.generationNo++;
}

Population.prototype.mateTop = function(){
	var i = 4
	while(i>1){
		this.mate(this.players[i], this.players[i-1]);
		i-=2;
	}
}

Population.prototype.mutate = function(){
	this.players.forEach(function(player){
			player.mutate(this.mutationChance);
	})
}

Population.prototype.kill = function(){
	var n = Math.ceil(this.elitism * this.size);

	this.players = this.players.slice(0, n);
}

/**
*
*  Player
*  @function getScore
*  @function random
*  @function reset
*  @function fitness
*  @function mate
*  @function mutate
*
**/

function Player(moves=[]){
	// console.log('new player', moves.length);
	this.moves = moves;
	this.keys = 0;
	this.barHit = 0;
	this.boundaryHit = 0;
	this.score = -9999;
	this.step = 2;
	this.output = [];
	this.steps = [];
	this.stars = 0;
}

Player.prototype.getScore = function(){
	this.evaluate();
	return this.score;
}

Player.prototype.random = function(length){
	var moves = [];
	for(var i = 0; i< length; i++){
		moves.push(Math.floor(Math.random()*3) - 1);
	}
	// console.log('random...', moves)
	this.moves = moves;
}

Player.prototype.reset = function(){
	this.barHit = 0;
	this.boundaryHit = 0;
	this.score = 0;
	this.steps = [];
	this.stars = 0;
}

Player.prototype.fitness = function(gameConfig){
	this.reset();
	var floor = false;

	var block = new Block(gameConfig);
	block.mark();
	// console.log(this.moves);
	
	this.moves.forEach((move, index)=>{
		var barNo = gameConfig.parts.indexOf(index + 1);
		if(!block.next(move)){
			
			if(barNo != -1){
				this.barHit++;
				this.steps.push(false);
				floor = false;
				var [ height , offset ] = gameConfig.vertical[barNo];
				block.move(offset + Math.floor(height/2), index + 1);
					
			}else{
				this.boundaryHit++;
				floor = true;
				block.move(Math.floor(gameConfig.rows/2), index + 1);
			}
			block.mark('+');
		}else{
			if(barNo != -1){
				this.steps.push(!floor);
				if(block.checkIntersection(gameConfig.starPositions[barNo], index + 1)){
					this.stars++;
				}
			}
		}
	})
	// console.log(this.steps);
	this.output = block.getTrace();
	this.keys = this.moves.length - this.moves.filter(move => move == 0).length;
	this.score = (-10)*(this.barHit + this.boundaryHit);
	if(this.score == 0){
		this.score += 10*this.stars + this.moves.length - this.keys;
	}
}

Player.prototype.mate = function(other, gameConfig){
	
	var newMoves = [];
	var chance =  Math.random()<0.5
	for(var i = 0; i< this.steps.length; i++){
		var barIndex = gameConfig.parts[i];
		var prev = 0;
		if(i>0){
			prev = gameConfig.parts[i-1];
		}
		if(this.steps[i] && chance){	
			newMoves = newMoves.concat(this.moves.slice(prev, barIndex))
		}else{
			newMoves = newMoves.concat(other.moves.slice(prev, barIndex))
		}
	}
	newMoves = newMoves.concat(this.moves.slice(newMoves.length));	

	return (new Player(newMoves));
}

Player.prototype.mutate = function(chance){
	if(Math.random() > chance)return;
	// console.log('mutate')
	var index = Math.floor(this.moves.length*Math.random());
	// console.log(index)
	var dir = Math.floor(Math.random()*2) + 1;
	var newEle = ((this.moves[index] + dir + 1)%3) - 1;
	this.moves[index] = newEle;
	
}


/**
*
*  Block
*  @function mark
*  @function next
*  @function getTrace
*  @function move
*  @function look
*  @function getCol
*  @function getIntersection
*
**/

function Block(gameConfig){
	this.height = 3;  // should be less than 5
	this.width = 1;
	this.row = Math.floor(gameConfig.rows/2) || 0; // ( middle of the block is at the middle row )
	this.col = 0;
	this.step = 1;
	this.board = gameConfig.board;
	this.trace = cloneGrid(gameConfig.trace);
}

Block.prototype.mark = function(char){
	// console.log('mark ...', this.row, this.col);
	this.trace[this.row][this.col] = char || "-";
	this.trace[this.row - 1][this.col] = char || "-";
	this.trace[this.row + 1][this.col] = char || "-";
}

Block.prototype.next = function(move){
	var newCol = this.col + 1;
	var newRow = this.row + this.step * move;
	if(this.look(newRow, newCol)){
		this.move(newRow, newCol);
		this.mark();
		return true;
	}
	return false;
}

Block.prototype.getTrace = function(){

	return this.trace;
}

Block.prototype.move = function(row, col){
	this.col = col;
	this.row = row;
}

Block.prototype.look = function(r, c){
	return 1 <= r && r < this.board.length - 1 && this.board[r - 1][c] && this.board[r][c] && this.board[r + 1][c];
}

Block.prototype.getCol = function(){ return this.col };


Block.prototype.checkIntersection = function(r, c){
	return Math.abs(this.row - r)<2 && this.col == c
}


/*= function to deep a clone an array by 1 level */
function cloneGrid(grid){
	return grid.map(row=> row.slice());
}
