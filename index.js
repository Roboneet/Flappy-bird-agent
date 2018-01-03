var Population = require('./ga.js');
var boardFactory = require('./game.js');

(function __init__(){
	var board = boardFactory();

	var pop = new Population({
		size: 50,
		"gameConfig":(board.getConfig()),
		debug:false,
		elitism: 0.1,
		threashold: 1000,
		mutationChance: .3,
		display
	});

	pop.start();
})();

function display(noImprovement){
	var best = this.players[0];
	var last = this.players[this.players.length - 1];
	if(this.generationNo % 5 == 0)
		console.log("(Score, no of bars hit, no of stars, no of keyStrokes) => best:: (", best.score, ",", best.barHit,',' ,best.stars, ',',best.keys ,' )  No_Improvement:', noImprovement);
	if(noImprovement == this.threashold || this.generationNo % 10 == 0){
		console.log('generation No', this.generationNo, best.score, noImprovement)
		var output = best.output.
			map(row=> row.filter((col, i)=> i < 140)).
			map(row => row.join('')).join('\n');
		console.log(output);

	}
}



