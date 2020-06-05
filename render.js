const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");

let mouse = {
	x: undefined,
	y: undefined
};
window.addEventListener("mousemove", function(e) {
	mouse.x = event.x;
	mouse.y = event.y;
});

function draw() {
	const height = canvas.height;
	const width = canvas.width;

	c.fillStyle = "rgb(200, 0, 0)";
	c.fillRect(10, 10, 50, 50);

	c.fillStyle = "rgba(0, 0, 200, 0.5)";
	c.fillRect(0, 0, 50, 50);
}
