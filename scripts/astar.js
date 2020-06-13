// eslint-disable-next-line no-unused-vars
async function astar(grid, start, end) {
	let open = [];
	let closed = [];
	let current;
	start.g = distance(start, start);
	start.h = distance(start, end);

	open.push(start);

	while (open.length > 0) {
		// eslint-disable-next-line no-undef
		if (showAlg) {
			for (let node of open) {
				node.isOpen = true;
			}
			for (let node of closed) {
				node.isClosed = true;
			}
			await sleep(50);
		}
		// current is node with smallest f cost in open list
		// eslint-disable-next-line no-undef
		current = _.min(open, node => node.f);
		// Remove current from the open list
		open.splice(open.indexOf(current), 1);
		// Push current onto the closed list
		closed.push(current);

		// If the current node is the end node, we are done
		if (current.xCoord === end.xCoord && current.yCoord === end.yCoord) {
			return current;
		}
		let neighbors = getNeighbors(current, grid);
		for (let neighbor of neighbors) {
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

	// eslint-disable-next-line no-undef
	let diagonal = _.min([ xDist, yDist ]);
	// eslint-disable-next-line no-undef
	let straight = _.max([ xDist, yDist ]) - diagonal;
	// Distance using manhattan and diagonal routes
	let dist = Math.sqrt(2) * diagonal + straight;
	return Math.round(dist * 10) / 10;
}

function getNeighbors(current, grid) {
	let neighbors = [];
	for (let x = -1; x <= 1; x++) {
		for (let y = -1; y <= 1; y++) {
			if (x === 0 && y === 0) {
				continue;
			}
			let neighX = current.xCoord + x;
			let neighY = current.yCoord + y;

			// eslint-disable-next-line no-undef
			if (neighX >= 0 && neighX < cellNumWide && neighY >= 0 && neighY < cellNumTall) {
				neighbors.push(grid[neighX][neighY]);
			}
		}
	}
	return neighbors;
}

// eslint-disable-next-line no-unused-vars
async function pathTrace(last) {
	let next = last;

	while (!next.parent.isStart) {
		next.parent.child = next;
		next = next.parent;
	}

	// For animation
	next.isPath = true;
	while (!next.child.isEnd) {
		next.child.isPath = true;
		next = next.child;
		await sleep(20);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
