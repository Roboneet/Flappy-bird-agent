var Population = require('./ga.js');
var boardFactory = require('./game.js');

(function __init__(){
	var board = boardFactory();

	var pop = new Population({
		size: 100,
		"gameConfig":(board.getConfig()),
		debug:false,
		elitism: 0.1,
		threashold: 10000,
		mutationChance: .05,
		display
	});

	pop.start();
})();

function display(noImprovement, bestPlayer){
	var best = this.players[0];
	var last = this.players[this.players.length - 1];
	if(this.generationNo % 10 == 0){
		console.log("#Generation: ",this.generationNo," (Score, no of stars, no of keyStrokes) => best:: (", best.score, "," ,best.stars, ',',best.keys ,' )  No_Improvement:', noImprovement);
		// console.log('generation No', this.generationNo, best.score, noImprovement)
		var output = best.output.
			map(row=> row.filter((col, i)=> i < 1000)).
			map(row => row.join('')).join('\n');
		console.log(output);

	}
	if(noImprovement == this.threashold){
		console.log("#Best (Score, no of stars, no of succesful keyStrokes) => (", best.score,',' ,best.stars, ',',best.keys );
		var output = bestPlayer.output.
			map(row=> row.filter((col, i)=> i < 140)).
			map(row => row.join('')).join('\n');
		console.log(output);
	}
}



