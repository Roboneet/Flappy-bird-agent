module.exports = boardFactory;

function boardFactory(){
	var board = new Board();
	board.findPositions();
	board.generateBoard();
	return board;	
}



/*
*  create game board
*/




function Board(){
	this.board = null;
	this.vertical = null;
	this.horizontal = null;
	this.rows = 25;
	this.cols = 120;
	this.starPositions = [];
}

Board.prototype.getConfig = function(){
	return {
		"board":this.board,
		"vertical":this.vertical,
		"horizontal":this.horizontal,
		"trace": this.getRowStrings(),
		"rows": this.rows,
		"cols": this.cols,
		"parts": this.parts,
		"starPositions": this.starPositions,
	}
}

Board.prototype.findPositions = function(){
	var horizontal = new Array(this.cols);
	var parts = [];
	var starPositions = [];
	horizontal.fill(false);
	for(var i = 0; i < this.cols; i+= 20){
		
		var pos = 17 + Math.floor(Math.random()*(3));
		horizontal[i + pos ] = true;
		parts.push(i + pos);
	}
	var vertical = [];
	parts.forEach(()=>{
		var height = Math.floor(Math.random()*6) + 5;
		var offset = Math.floor((this.rows - height + 1)* Math.random());
		vertical.push([height, offset]);
		starPositions.push(offset + Math.floor(Math.random()* height));
	})

	
	Object.assign(this,{
		horizontal,
		vertical,
		parts, 
		starPositions
	});
}

Board.prototype.generateBoard = function(){
	var plan = [];
	for(var i = 0; i< this.rows; i++){
		var row = [];
		var barNo = 0;
		this.horizontal.forEach((ele, index)=>{
			if(ele){
				
				var [height, offset] = this.vertical[barNo];
				

				if(offset<=i && i< offset + height){
					if(this.starPositions[barNo] == i)
						row.push(2);
					else 
						row.push(1);
				}else{
					row.push(0);
				}
				barNo++;
			}else{
				row.push(1);
			}
		});
		plan.push(row);
	}

	this.board = plan;
}

Board.prototype.getRowStrings = function(board){
	return this.board.map((row)=>{
		
		return row.map((ele, i)=> ((ele != 0)?((ele == 1)?" ":"*"):"|"));
	});
}
