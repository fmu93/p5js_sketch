var particles = [];
var nParticles = 1000;
var flowField;
var hpaths = [];
var nhPaths = 4;
var vpaths = [];
var nvPaths = 4;
var ishSLX = true;
var isvSLX = true;

function setup() {
	createCanvas(800, 800);
	background(220);

	for (var i = 0; i < nParticles; i++) {
		particles[i] = new Particle();
	}

	flowField = new FlowField();
	flowField.init();

	// create vertical lines
	for (var j = 0; j < nvPaths; j++) {
		vpaths[j] = new Path(createVector(width/(nvPaths+1)*(j+1), 0), createVector(width/(nvPaths+1)*(j+1), height));
	}
	// create horizontal lines
	for (var k = 0; k < nhPaths; k++) {
		hpaths[k] = new Path(createVector(0, height/(nhPaths+1)*(k+1)), createVector(width, height/(nhPaths+1)*(k+1)));
	}

}

function draw() {
	background(220);
	// flowField.display();
	// show paths			
	// for (var j = 0; j < vpaths.length; j++) {
	// 	vpaths[j].display();
	// }
	// for (var j = 0; j < hpaths.length; j++) {
	// 	hpaths[j].display();
	// }

	// particles
	for (var i = particles.length - 1; i > 0; i--) {
		particles[i].applyForce(createVector(random(-0.15, 0.15), random(-0.15, 0.15)));
		if (!ishSLX && !isvSLX) {
			particles[i].applyForce(flowField.lookup(particles[i].pos));
		} else {
			if (isvSLX) {
				// vertical lines (size)
				if (particles[i].type2 == 0) {
					particles[i].follow(vpaths[0]);
				} else if (particles[i].type2 == 1) {
					particles[i].follow(vpaths[1]);
				} else if (particles[i].type2 == 2) {
					particles[i].follow(vpaths[2]);
				} else if (particles[i].type2 == 3) {
					particles[i].follow(vpaths[3]);
				}
			}
			if (ishSLX) {
			// horizontal lines (color)
				if (particles[i].type1 == 0) {
					particles[i].follow(hpaths[0]);
				} else if (particles[i].type1 == 1) {
					particles[i].follow(hpaths[1]);
				} else if (particles[i].type1 == 2) {
					particles[i].follow(hpaths[2]);
				} else if (particles[i].type1 == 3) {
					particles[i].follow(hpaths[3]);
				}
			}
			
		}
		particles[i].run();
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

function mouseClicked() {
	ishSLX = !ishSLX;
	isvSLX = !isvSLX;

	for (var i = particles.length - 1; i > 0; i--) {
		particles[i].applyForce(createVector(random(-10, 10), random(-10, 10)));
	}

}

