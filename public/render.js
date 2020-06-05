let canvas;
let c;
let mouse = {
	x: undefined,
	y: undefined
};

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

init();

function init() {
	canvas = document.querySelector("#canvas");
	console.log(canvas);
	console.log(this);

	c = canvas.getContext("2d");
	draw();
}

window.addEventListener("mousemove", function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
});
window.addEventListener("click", event => {
	console.log(mouse.x, mouse.y);
});

function draw() {
	// const height = canvas.height;
	// const width = canvas.width;

	c.fillStyle = "rgb(200, 0, 0)";
	c.fillRect(10, 10, 50, 50);

	c.fillStyle = "rgba(0, 0, 200, 0.5)";
	c.fillRect(0, 0, 50, 50);
}
