module.exports = Population
var Player = require('./player');
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


Population.prototype.run = function({noImprovement=0,lastScore=false, bestPlayer} = {}){
	this.log('run...')	
	lastScore = lastScore || this.players[0].score;
	if(noImprovement<this.threashold){
		
		var best = this.generation(noImprovement);
		// console.log(lastScore, this.players[0].score)
		if(lastScore >= best.score){
			noImprovement++
		}else{
			noImprovement = 0;
			bestPlayer = best;
			lastScore = best.score;
		}	

		var __self__ = this;
		setTimeout(function(){
			__self__.run({
				noImprovement,
				"lastScore":lastScore,
				"bestPlayer": bestPlayer
			});
		}, 1);
		return false;
	}else{
		if(lastScore && lastScore > 0){ // okay ! constant +ve score
			this.display(noImprovement, bestPlayer);
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
	player.mate(opponent, this.gameConfig).forEach((el, i)=>{
		this.players = this.players.concat(el);	
	});
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
	var best = JSON.parse(JSON.stringify(this.players[0]));
	this.kill();
	this.mateTop();
	this.fill();
	this.mutate();
	this.generationNo++;
	return best
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
