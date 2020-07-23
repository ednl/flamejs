const CANVASSIZE = 1000;
const PIXPERUNIT = CANVASSIZE / 2;

const SAMPLES = 10000;
const ITERATIONS = 100;
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

// Sierpinski's Gasket function 0
function Sierpinski0(x, y) {
	return [ x / 2, y / 2 ];
}

// Sierpinski's Gasket function 1
function Sierpinski1(x, y) {
	return [ (x + 1) / 2, y / 2 ];
}

// Sierpinski's Gasket function 2
function Sierpinski2(x, y) {
	return [ x / 2, (y + 1) / 2 ];
}

// Bilateral symmetry X
function BilateralSymX(x, y) {
	return [-x, y];
}

// Bilateral symmetry Y
function BilateralSymY(x, y) {
	return [x, -y];
}

// Linear variation
function Variation0(x, y) {
	return [x, y];
}

// Sinusoidal variation
function Variation1(x, y) {
	return [Math.sin(x), Math.sin(y)];
}

// Spherical variation
function Variation2(x, y) {
	const r2 = x * x + y * y;
	return [x / r2, y / r2];
}

// Swirl variation
function Variation3(x, y) {
	const r2 = x * x + y * y;
	const s = Math.sin(r2);
	const c = Math.cos(r2);
	return [x * s - y * c, x * c + y * s];
}

// Horseshoe variation
function Variation4(x, y) {
	const r = Math.sqrt(x * x + y * y);
	return [(x - y) * (x + y) / r, 2 * x * y / r];
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
	stroke(255, 20);
	noLoop();

	// Transformation functions
	F[0] = Sierpinski0;
	F[1] = Sierpinski1;
	F[2] = Sierpinski2;
	// F[3] = BilateralSymX;
	// F[4] = BilateralSymY;
	// F[0] = Variation0;
	// F[1] = Variation1;
	// F[2] = Variation2;

	// Function weights
	W[0] = 1;
	W[1] = 1;
	W[2] = 1;
	// W[3] = 3;
	// W[4] = 3;

	// Normalise and accumulate function weights
	const sum = W.reduce((a, b) => a + b);
	if (sum > 0) {
		W = W.map(a => a / sum);
		for (let i = 1; i < W.length; ++i)
			W[i] += W[i - 1];
	}
}

function draw() {
	let x, y;
	for (let i = 0; i < SAMPLES; ++i) {

		// Sample a point from the bi-unit square
		x = random(-1, 1);
		y = random(-1, 1);

		// Gravitate towards the first value
		for (let j = 0; j < SKIP - 1; ++j )
			[x, y] = transform(x, y);

		// Draw multiple points from there
		for (let j = SKIP; j < ITERATIONS; ++j ) {
			[x, y] = transform(x, y);
			spoint(x, y);
		}
	}
}
