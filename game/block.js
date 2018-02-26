module.exports = Block


/**
*
*  Block
*  @function mark
*  @function next
*  @function getTrace
*  @function move
*  @function look
*  @function getCol
*  @function getRow
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
Block.prototype.getRow = function(){ return this.row };


Block.prototype.checkIntersection = function(r, c){
	return Math.abs(this.row - r)<2 && this.col == c
}


/*= function to deep a clone an array by 1 level */
function cloneGrid(grid){
	return grid.map(row=> row.slice());
}
