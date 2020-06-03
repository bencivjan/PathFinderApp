function draw() {
	const canvas = document.querySelector("#canvas");
	const ctx = canvas.getContext("2d");

	const height = canvas.height;
	const width = canvas.width;

	ctx.fillStyle = "rgb(200, 0, 0)";
	ctx.fillRect(10, 10, 50, 50);

	ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
	ctx.fillRect(0, 0, 50, 50);
}
