# BLOCK GAME SOLVER
## Using genetic Algorithms to find the best solution to a puzzle

Block game is a game in which a block navigates through space with barriers to reach the other end collecting the maximum amount of stars while minimizing the number of keystrokes.

## Usage

`node index.js`

## Game Rules

The player can take 3 actions : Go straight , go up, go down.
Do not hit the barriers or cross the boundary
Collecting stars gain extra points.

### Output

'|' represent the barrier
all the 3 '-' in one column make up one block
'*' represents the star not collected
The path taken by the player is traced


## Files

##### index.js
initialises values for the genetic algorithm

##### game.js
Creates a new board
Classes : Board

##### ga.js
Contains the genetic algorithm
Classes : Population, Player, Block