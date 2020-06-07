/** Canvas */
let canvas;
/** Canvas context */
let c;
let runBtn;
let clearBtn;

let mouse = {
	x: undefined,
	y: undefined
};
let cells = 20;
let gridVals = [];
let startNodeSelect = false;
let endNodeSelect = false;

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
animate();

// INITIALIZATION FUNCTION
function init() {
	canvas = document.querySelector("#canvas");
	c = canvas.getContext("2d");
	runBtn = document.querySelector("#run");
	clearBtn = document.querySelector("#clear");

	// MOUSE MOVE LISTENER
	window.addEventListener("mousemove", function(event) {
		mouse.x = event.offsetX;
		mouse.y = event.offsetY;
	});

	// MOUSE CLICK LISTENER
	canvas.addEventListener("click", event => {
		// TODO: Improve searching

		// Loop through all nodes to check if click event happened in it
		outer: for (let x in gridVals) {
			for (let y in gridVals[x]) {
				let node = gridVals[x][y];
				// Check if click happened in this node
				if (c.isPointInPath(node.path, event.offsetX, event.offsetY)) {
					node.isWall = !node.isWall;
					//Break search if we found target
					break outer;
				}
			}
		}
	});

	runBtn.addEventListener("click", () => {
		// TODO: Run a* algorithm here
	});

	clearBtn.addEventListener("click", () => initGrid(cells));

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

// RENDERS GRID
function renderGrid() {
	for (let x in gridVals) {
		for (let y in gridVals[x]) {
			let node = gridVals[x][y];
			c.strokeStyle = "gray";
			c.lineWidth = 2;
			c.fillStyle = "#eeeeee";
			if (node.isWall) c.fillStyle = "lightblue";
			if (node.isPath) c.fillStyle = "lightyellow";
			if (node.isStart) c.fillStyle = "blue";
			if (node.isEnd) c.fillStyle = "red";
			if (c.isPointInPath(node.path, mouse.x, mouse.y)) {
				let red = Math.round(parseInt(`0x${c.fillStyle.slice(1, 3)}`) * 0.8).toString(16);
				let green = Math.round(parseInt(`0x${c.fillStyle.slice(3, 5)}`) * 0.8).toString(16);
				let blue = Math.round(parseInt(`0x${c.fillStyle.slice(5, 7)}`) * 0.8).toString(16);

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
