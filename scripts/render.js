/** Canvas */
let canvas;
/** Canvas context */
let c;
let runBtn;
let clearBtn;
let resetBtn;
let showAlgorithmCheckbox;
let errorMessage;

// Mouse variables
let mouse = {
	x: undefined,
	y: undefined,
	shiftPress: undefined,
	isDown: false
};

// Grid variables
let gridCellWidth = 25;
let gridCellHeight = 25;
let cellNumWide;
let cellNumTall;
let gridVals = [];

// Animation variables
let startNodeSelect = false;
let endNodeSelect = false;
let startNode;
let endNode;
let lastNode;
// eslint-disable-next-line no-unused-vars
let showAlg;

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
	resetBtn = document.querySelector("#reset");
	showAlgorithmCheckbox = document.querySelector("#animate");
	errorMessage = document.querySelector("#errorMessage");

	// MOUSE MOVE LISTENER
	canvas.addEventListener("mousemove", function(event) {
		mouse.x = event.offsetX;
		mouse.y = event.offsetY;
	});

	// MOUSE CLICK LISTENER
	window.addEventListener("mousedown", event => {
		mouse.isDown = true;
		mouse.shiftPress = event.shiftKey;
	});
	window.addEventListener("mouseup", () => {
		mouse.isDown = false;
	});

	runBtn.addEventListener("click", () => {
		clearPath();
		// TODO: Run a* algorithm here
		showAlg = showAlgorithmCheckbox.checked;

		(async () => {
			try {
				// eslint-disable-next-line no-undef
				let result = await astar(gridVals, startNode, endNode);
				// eslint-disable-next-line no-undef
				await pathTrace(result);
			} catch (e) {
				errorMessage.style.display = "block";
			}
		})();
	});

	resetBtn.addEventListener("click", () => clearPath());

	clearBtn.addEventListener("click", () => initGrid(gridCellWidth, gridCellHeight));

	initGrid(gridCellWidth, gridCellHeight);

	initStartAndEndNodes([ 1, Math.round(cellNumTall / 2) ], [ cellNumWide - 2, Math.round(cellNumTall / 2) ]);
}

// INITIALIZE GRID
function initGrid(cellWidth, cellHeight) {
	const offset = 80;
	const height = canvas.height - offset;
	const width = canvas.width - offset;

	errorMessage.style.display = "none";

	cellNumWide = Math.round(width / cellWidth);
	cellNumTall = Math.round(height / cellHeight);

	gridVals = [];

	for (let x = 0; x < cellNumWide; x++) {
		// Create new nested array
		gridVals.push(new Array(cellNumTall));

		for (let y = 0; y < cellNumTall; y++) {
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
			c.lineWidth = 0.2;
			c.fillStyle = "#fafafa"; // light gray
			//For showing algorithm
			if (node.isOpen) c.fillStyle = "#bde2d3"; //light teal
			if (node.isClosed) c.fillStyle = "#80b2b0"; //teal

			if (node.isPath) c.fillStyle = "#f9be39"; //gold
			if (node.isWall) c.fillStyle = "#464c61"; //dark slate blueish
			if (node.isStart) c.fillStyle = "#3f4fa2"; //blueish
			if (node.isEnd) c.fillStyle = "#ee322f"; //red-orange

			if (c.isPointInPath(node.path, mouse.x, mouse.y)) {
				if (mouse.isDown) {
					// Node dragging logic
					node.setNode();

					node.setNodeSelect();

					if (lastNode && (lastNode.xCoord !== node.xCoord || lastNode.yCoord !== node.yCoord)) {
						if (startNodeSelect) lastNode.isStart = false;
						if (endNodeSelect) lastNode.isEnd = false;
					}
					// Wall logic
					if (!node.isStart && !node.isEnd) {
						node.isWall = true;
						if (mouse.shiftPress) node.isWall = false;
					}
					lastNode = node;
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

function clearPath() {
	errorMessage.style.display = "none";

	for (let x in gridVals) {
		for (let y in gridVals[x]) {
			let node = gridVals[x][y];
			node.isPath = false;
			node.isOpen = false;
			node.isClosed = false;
			node.g = Number.POSITIVE_INFINITY;
			node.h = Number.POSITIVE_INFINITY;
			node.parent = undefined;
			node.child = undefined;
		}
	}
}
