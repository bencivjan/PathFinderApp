/** Canvas */
let canvas;
/** Canvas context */
let c;
let mouse = {
	x: undefined,
	y: undefined
};
let cells = 10;
let gridVals = [];

class GridNode {
	constructor(isWall, xCoord, yCoord, path, g = Number.POSITIVE_INFINITY, h = Number.POSITIVE_INFINITY) {
		this.isWall = isWall;
		this._xCoord = xCoord;
		this._yCoord = yCoord;
		this.path = path;
		this.g = g;
		this.h = h;
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

//==================
//RUNNING CODE HERE
//==================

init();

// MOUSE MOVE LISTENER
window.addEventListener("mousemove", function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
});

// MOUSE CLICK LISTENER
canvas.addEventListener("click", event => {
	// Loop through all nodes to check if click event happened in it
	outer: for (let x in gridVals) {
		for (let y in gridVals[x]) {
			let node = gridVals[x][y];
			// Check if click happened in this node
			if (c.isPointInPath(node.path, event.offsetX, event.offsetY)) {
				console.log(node.xCoord, node.yCoord);

				//Break search if we found target
				break outer;
			}
		}
	}
});

// INITIALIZATION FUNCTION
function init() {
	canvas = document.querySelector("#canvas");
	c = canvas.getContext("2d");

	initGrid(cells);
}

// INITIALIZE GRID
function initGrid(cellNum) {
	const height = canvas.height;
	const width = canvas.width;

	c.strokeStyle = "gray";
	c.lineWidth = 2;
	c.fillStyle = "#eeeeee";

	let cellWidth = width / cellNum;
	let cellHeight = height / cellNum;

	for (let x = 0; x < cellNum; x++) {
		// Create new nested array
		gridVals.push(new Array(cellNum));

		for (let y = 0; y < cellNum; y++) {
			let node = new GridNode(false, x, y);

			// Create rectangle path and store in GridNode object
			node.path = new Path2D();
			node.path.rect(cellWidth * x, cellHeight * y, cellWidth, cellHeight);

			// Draw GridNode on the canvas
			c.fill(node.path);
			c.stroke(node.path);
			// Store the node in the grid array
			gridVals[x][y] = node;
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
}
