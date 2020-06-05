const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.listen(3005, () => console.log("Pathfinder started"));
