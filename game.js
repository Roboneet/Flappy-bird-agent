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
	this.rows = 40;
	this.cols = 140;
}

Board.prototype.getConfig = function(){
	return {
		"board":this.board,
		"vertical":this.vertical,
		"horizontal":this.horizontal,
		"trace": this.getRowStrings(),
		"rows": this.rows,
		"cols": this.cols,
		"parts": this.parts
	}
}

Board.prototype.findPositions = function(){
	var horizontal = new Array(this.cols);
	var parts = [];
	horizontal.fill(false);
	for(var i = 0; i < this.cols; i+= 20){
		
		var pos = 10 + Math.floor(Math.random()*(10));
		horizontal[i + pos ] = true;
		parts.push(i + pos);
	}
	var vertical = [];
	parts.forEach(()=>{
		var height = Math.floor(Math.random()*6) + 5;
		var offset = Math.floor((this.rows - height + 1)* Math.random());
		vertical.push([height, offset]);
	})

	
	Object.assign(this,{
		horizontal,
		vertical,
		parts
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
				barNo++;

				if(offset<=i && i< offset + height){
					row.push(true);
				}else{
					row.push(false);
				}
			}else{
				row.push(true);
			}
		});
		plan.push(row);
	}

	this.board = plan;
}

Board.prototype.getRowStrings = function(board){
	return this.board.map((row)=>{
		
		return row.map((ele, i)=> ((ele)?" ":"|"));
	});
}
