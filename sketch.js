const CANVASSIZE = 1000;
const PIXPERUNIT = CANVASSIZE / 2;

const SAMPLES = 10000;
const ITERATIONS = 50;
const SKIP = 20;

let F = [];  // transformation functions
let W = [];  // accumulated function weights

// Scale bi-unit square coordinate -1..+1 to canvas pixel 0..CANVASSIZE
function pix(x) {
	return (x + 1) * PIXPERUNIT;
}

// Scaled point function
function spoint(x, y) {
	point(pix(x), pix(y));
}

// Transformation function 0
function f0(x, y) {
	return [ x / 2, y / 2 ];
}

// Transformation function 1
function f1(x, y) {
	return [ (x + 1) / 2, y / 2 ];
}

// Transformation function 2
function f2(x, y) {
	return [ x / 2, (y + 1) / 2 ];
}

function transform(x, y) {
	// Pick a function F_i
	let i = 0
	const r = random(1);
	while (r >= W[i])
		++i;
	// Use function F_i to transform (x,y)
	return F[i](x, y);
}

function setup() {
	createCanvas(CANVASSIZE, CANVASSIZE);
	background(0);
	noFill();
	strokeWeight(1);
	// For now, paint every pixel the same colour
	stroke(255, 100);
	noLoop();

	// Transformation functions
	F[0] = f0;
	F[1] = f1;
	F[2] = f2;

	// Function weights
	W[0] = 1;
	W[1] = 1;
	W[2] = 1;

	// Normalise function weights
	const sum = W.reduce((a, b) => a + b);
	if (sum > 0) {
		W = W.map(a => a / sum);
		for (let i = 1; i < W.length; ++i) {
			W[i] += W[i - 1];
		}
	}
}

function draw() {
	let x, y;
	for (let sample = 0; sample < SAMPLES; ++sample) {

		// Sample a point from the bi-unit square
		x = random(-1, 1);
		y = random(-1, 1);

		// Gravitate towards the first value
		for (let i = 0; i < SKIP - 1; ++i )
			[x, y] = transform(x, y);

		// Draw multiple points from here
		for (let i = SKIP; i < ITERATIONS; ++i ) {
			[x, y] = transform(x, y);
			spoint(x, y);
		}
	}
}
