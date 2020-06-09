/** Canvas */
let canvas;
/** Canvas context */
let c;
let runBtn;
let clearBtn;

// Mouse variables
let mouse = {
	x: undefined,
	y: undefined,
	shiftPress: undefined
};
let mouseDown = false;

// Grid variables
let cells = 20;
let gridVals = [];

let startNodeSelect = false;
let endNodeSelect = false;
let startNode;
let endNode;
let lastNode;

class GridNode {
	constructor(isWall, xCoord, yCoord, path, g = Number.POSITIVE_INFINITY, h = Number.POSITIVE_INFINITY) {
		this.isWall = isWall;
		this._xCoord = xCoord;
		this._yCoord = yCoord;
		this.path = path;
		// this.color = color;
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

	setNodeSelect() {
		if (this.isStart) {
			startNodeSelect = true;
		} else if (this.isEnd) {
			endNodeSelect = true;
		} else {
			startNodeSelect = false;
			endNodeSelect = false;
		}
	}
	setNode() {
		if (startNodeSelect) {
			this.isStart = true;
			startNode = this;
		} else if (endNodeSelect) {
			this.isEnd = true;
			endNode = this;
		}
	}
}

//==================
//RUNNING CODE HERE
//==================

init();
animate();

// INITIALIZATION FUNCTION
function init() {
	canvas = document.querySelector("#canvas");
	c = canvas.getContext("2d", { alpha: false });
	runBtn = document.querySelector("#run");
	clearBtn = document.querySelector("#clear");

	// MOUSE MOVE LISTENER
	canvas.addEventListener("mousemove", function(event) {
		mouse.x = event.offsetX;
		mouse.y = event.offsetY;
		mouse.shiftPress = event.shiftKey;
	});

	// MOUSE CLICK LISTENER
	window.addEventListener("mousedown", () => {
		mouseDown = true;
	});
	window.addEventListener("mouseup", () => {
		mouseDown = false;
	});

	runBtn.addEventListener("click", () => {
		// TODO: Run a* algorithm here
		// eslint-disable-next-line no-undef
		pathTrace(astar(gridVals, startNode, endNode));
	});

	clearBtn.addEventListener("click", () => initGrid(cells));

	initGrid(cells);
	initStartAndEndNodes([ 1, 10 ], [ 18, 10 ]);
}

// INITIALIZE GRID
function initGrid(cellNum) {
	const offset = 80;
	const height = canvas.height - offset;
	const width = canvas.width - offset;

	let cellWidth = width / cellNum;
	let cellHeight = height / cellNum;

	gridVals = [];

	for (let x = 0; x < cellNum; x++) {
		// Create new nested array
		gridVals.push(new Array(cellNum));

		for (let y = 0; y < cellNum; y++) {
			let node = new GridNode(false, x, y);
			// Create rectangle path and store in GridNode object
			node.path = new Path2D();
			node.path.rect(offset / 2 + cellWidth * x, offset / 2 + cellHeight * y, cellWidth, cellHeight);

			// Check to see if this node is the starting/end node, if so then set its property
			if (startNode && (node.xCoord === startNode.xCoord && node.yCoord === startNode.yCoord)) {
				node.isStart = true;
			}
			if (endNode && (node.xCoord === endNode.xCoord && node.yCoord === endNode.yCoord)) {
				node.isEnd = true;
			}
			// Store the node in the grid array
			gridVals[x][y] = node;
		}
	}
}

function initStartAndEndNodes(start, end) {
	// Initial start and end nodes
	startNode = gridVals[start[0]][start[1]];
	startNode.isStart = true;
	endNode = gridVals[end[0]][end[1]];
	endNode.isEnd = true;
}

// RENDERS GRID
function renderGrid() {
	for (let x in gridVals) {
		for (let y in gridVals[x]) {
			let node = gridVals[x][y];
			c.strokeStyle = "gray";
			c.lineWidth = 1;
			c.fillStyle = "#eeeeee";
			if (node.isWall) c.fillStyle = "lightblue";
			if (node.isPath) c.fillStyle = "gold";
			if (node.isStart) c.fillStyle = "green";
			if (node.isEnd) c.fillStyle = "red";

			if (c.isPointInPath(node.path, mouse.x, mouse.y)) {
				if (mouseDown) {
					node.setNode();

					node.setNodeSelect();

					if (lastNode && (lastNode.xCoord !== node.xCoord || lastNode.yCoord !== node.yCoord)) {
						if (startNodeSelect) lastNode.isStart = false;
						if (endNodeSelect) lastNode.isEnd = false;
					}
					if (node.isStart) {
						lastNode = node;
					} else if (node.isEnd) {
						lastNode = node;
					} else {
						node.isWall = true;
						if (mouse.shiftPress) node.isWall = false;
					}
				} else {
					startNodeSelect = false;
					endNodeSelect = false;
				}

				// Parsing to hex and back logic for color dimming
				let red = Math.round(parseInt(`0x${c.fillStyle.slice(1, 3)}`) * 0.8).toString(16);
				if (red.length === 1) red = "0" + red;
				let green = Math.round(parseInt(`0x${c.fillStyle.slice(3, 5)}`) * 0.8).toString(16);
				if (green.length === 1) green = "0" + green;
				let blue = Math.round(parseInt(`0x${c.fillStyle.slice(5, 7)}`) * 0.8).toString(16);
				if (blue.length === 1) blue = "0" + blue;

				c.fillStyle = "#" + red + green + blue;
			}

			c.fill(node.path);
			c.stroke(node.path);
		}
	}
}

function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0, 0, canvas.width, canvas.height);
	renderGrid();
}
