const _ = require("underscore");

class Node {
	constructor(isWall, xCoord, yCoord, displayVal, g = Number.POSITIVE_INFINITY, h = Number.POSITIVE_INFINITY) {
		this.isWall = isWall;
		this._xCoord = xCoord;
		this._yCoord = yCoord;
		this.g = g;
		this.h = h;
		this.displayVal = displayVal;
	}
	get xCoord() {
		return this._xCoord;
	}
	get yCoord() {
		return this._yCoord;
	}
	get f() {
		return this.g + this.h;
	}
}

// ALGORITHM

let grid = [ [], [], [], [], [], [], [], [], [], [] ];

for (let x = 0; x < 10; x++) {
	for (let y = 0; y < 10; y++) {
		grid[x][y] = new Node(false, x, y, "   ");
	}
}

let start = grid[0][6];
let end = grid[9][9];

//Wall tests
grid[5][9].isWall = true;
grid[5][8].isWall = true;
grid[5][7].isWall = true;
grid[5][6].isWall = true;
// grid[5][5].isWall = true;
grid[5][4].isWall = true;

let last = astar(start, end);

pathTrace(last);

printGrid();

function astar(start, end) {
	let open = [];
	let closed = [];
	let current;
	start.g = distance(start, start);
	start.h = distance(start, end);

	//FOR PRINTING PURPOSES
	start.displayVal = "Start";

	open.push(start);

	while (open.length > 0) {
		// current is node with smallest f cost in open list
		current = _.min(open, node => node.f);
		// Remove current from the open list
		open.splice(open.indexOf(current), 1);
		// Push current onto the closed list
		closed.push(current);

		// If the current node is the end node, we are done
		if (current.xCoord === end.xCoord && current.yCoord === end.yCoord) {
			return current;
		}
		let neighbors = getNeighbors(current);
		for (let neighbor of neighbors) {
			if (neighbor.isWall) {
				// THIS IS ONLY FOR PRINTING/DEBUGGING PURPOSES
				neighbor.displayVal = "[XXX]";
			}
			// If neighbor is not walkable or in the closed list, skip to next neighbor
			if (neighbor.isWall || closed.indexOf(neighbor) >= 0) {
				continue;
			}
			// If path to neighbor (g cost) is shorter than current
			if (distance(start, neighbor) < neighbor.g) {
				// Set f cost (through g and h)
				neighbor.g = distance(start, neighbor);
				neighbor.h = distance(neighbor, end);
				// Set parent of neighbor to current
				neighbor.parent = current;
			}
			// If neighbor is not in open list, add it to open list
			if (open.indexOf(neighbor) < 0) {
				open.push(neighbor);
			}
		}
	}
}

function distance(current, destination) {
	let xDist = Math.abs(current.xCoord - destination.xCoord);
	let yDist = Math.abs(current.yCoord - destination.yCoord);

	let diagonal = _.min([ xDist, yDist ]);
	let straight = _.max([ xDist, yDist ]) - diagonal;
	// Distance using manhattan and diagonal routes
	let dist = Math.sqrt(2) * diagonal + straight;
	return Math.round(dist * 10) / 10;
}

function getNeighbors(current) {
	let neighbors = [];
	for (let x = -1; x <= 1; x++) {
		for (let y = -1; y <= 1; y++) {
			if (x === 0 && y === 0) {
				continue;
			}
			let neighX = current.xCoord + x;
			let neighY = current.yCoord + y;

			if (neighX >= 0 && neighX < 10 && neighY >= 0 && neighY < 10) {
				neighbors.push(grid[neighX][neighY]);
			}
		}
	}
	return neighbors;
}

function pathTrace(last) {
	let next = last;

	while (next.parent.displayVal != "Start") {
		next.parent.displayVal = "[---]";
		next = next.parent;
	}
	last.displayVal = "End";
}

function printGrid() {
	let printableGrid = [ [], [], [], [], [], [], [], [], [], [] ];
	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			printableGrid[x][y] = grid[x][y].displayVal;
		}
	}

	console.table(printableGrid);
}
