module.exports = Player

var Block = require('./block');
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
	this.keys = 0;
}

Player.prototype.fitness = function(gameConfig){
	this.reset();
	var floor = false;

	var block = new Block(gameConfig);
	block.mark();
	// console.log(this.moves);
	
	// this.moves.forEach((move, index)=>{
	// 	var barNo = gameConfig.parts.indexOf(index + 1);
	// 	if(!block.next(move)){
			
	// 		if(barNo != -1){
	// 			this.barHit++;
	// 			this.steps.push(false);
	// 			floor = false;
	// 			var [ height , offset ] = gameConfig.vertical[barNo];
	// 			block.move(offset + Math.floor(height/2), index + 1);
					
	// 		}else{
	// 			this.boundaryHit++;
	// 			floor = true;
	// 			block.move(Math.floor(gameConfig.rows/2), index + 1);
	// 		}
	// 		block.mark('+');
	// 	}else{
	// 		if(barNo != -1){
	// 			this.steps.push(!floor);
	// 			if(block.checkIntersection(gameConfig.starPositions[barNo], index + 1)){
	// 				this.stars++;
	// 			}
	// 		}
	// 	}
	// })
	// // console.log(this.steps);
	// this.output = block.getTrace();
	// this.keys = this.moves.length - this.moves.filter(move => move == 0).length;
	// this.score = (-10)*(this.barHit + this.boundaryHit);
	// if(this.score == 0){
	// 	this.score += 10*this.stars + this.moves.length - this.keys;
	// }
	// console.log(this.moves)
	this.moves.forEach((move, index)=>{
		if(block.next(move)){
			this.keys++;

			var barNo = gameConfig.parts.indexOf(index + 1);
			if(block.checkIntersection(gameConfig.starPositions[barNo], index + 1)){
				this.stars++;
			}
		}else{
			block.mark('+');
		}
	})
	this.output = block.getTrace();
	this.score = this.keys + 10*this.stars;
	if(this.keys == 119)this.score += this.moves.filter(ele=> (ele == 0)).length;
}

Player.prototype.mate = function(other, gameConfig){
	
	// var newMoves = [];
	// var chance =  Math.random()<0.5
	// for(var i = 0; i< this.steps.length; i++){
	// 	var barIndex = gameConfig.parts[i];
	// 	var prev = 0;
	// 	if(i>0){
	// 		prev = gameConfig.parts[i-1];
	// 	}
	// 	if(this.steps[i] && chance){	
	// 		newMoves = newMoves.concat(this.moves.slice(prev, barIndex))
	// 	}else{
	// 		newMoves = newMoves.concat(other.moves.slice(prev, barIndex))
	// 	}
	// }
	// newMoves = newMoves.concat(this.moves.slice(newMoves.length));	

	// return (new Player(newMoves));

	var partition = Math.ceil(Math.random()*this.moves.length);
	var a = this.moves.slice(0, partition).concat(other.moves.slice(partition, this.moves.length));
	var b = other.moves.slice(0, partition).concat(this.moves.slice(partition, this.moves.length));

	return [new Player(a), new Player(b)];

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