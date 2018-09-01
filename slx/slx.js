var particles = [];
var n = 1000;
var flowField;
var paths = [];

function setup() {
	createCanvas(1200, 800);
	background(220);

	for (var i = 0; i < n; i++) {
		particles[i] = new Particle();
	}

	flowField = new FlowField();
	flowField.init();

	paths[0] = new Path(createVector(width/5, 0), createVector(width/5, height));
}

function draw() {
	background(220);

	// particles
	for (var i = particles.length - 1; i > 0; i--) {
		// particles[i].applyForce(createVector(random(-1, 1), random(-1, 1)));
		particles[i].applyForce(flowField.lookup(particles[i].pos));
		particles[i].run();
	}

	// show paths
	for (var j = 0; j < paths.length; j++) {
		paths[j].display();
	}

	// SLX text
	fill(200);
	rectMode(CENTER)
	textSize(120);
	textStyle(BOLD);
	textAlign(CENTER);
	text("SLX", width/2, height/2);

	// move flowField
	flowField.timeStep();

}

