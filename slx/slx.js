var particles = [];
var nParticles = 1010;
var flowField;
var hpaths = [];
var nhPaths = 4;
var vpaths = [];
var nvPaths = 4;
var ishSLX = false;
var isvSLX = false;
var nclicks = 0;

function setup() {
	createCanvas(800, 400);
	background(225);

	for (var i = 0; i < nParticles; i++) {
		particles[i] = new Particle();
		if (i%100 == 0) {
			particles[i].color = [0, 0];
			particles[i].stroke = [0, 0];
		}
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
	background(225);
	// flowField.display();
	// show paths			
	// for (var j = 0; j < vpaths.length; j++) {
	// 	vpaths[j].display();
	// }
	// for (var j = 0; j < hpaths.length; j++) {
	// 	hpaths[j].display();
	// }
	
	// SLX text
	fill(190);
	rectMode(CENTER)
	textSize(160);
	textStyle(BOLD);
	textAlign(CENTER);
	text("SILEXICA", width/2, height*4/6);

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

	// move flowField
	flowField.timeStep();
}

function mouseClicked() {
	if (nclicks == 0) {
		ishSLX = true;
		isvSLX = false;
	} else if (nclicks == 1) {
		ishSLX = false;
		isvSLX = true;
	} else if (nclicks == 2) {
		ishSLX = true;
		isvSLX = true;	
	} else if (nclicks == 3) {
		ishSLX = false;
		isvSLX = false;	
	}
	
	nclicks = (nclicks+ 1)%4

	for (var i = particles.length - 1; i > 0; i--) {
		particles[i].applyForce(createVector(random(-10, 10), random(-10, 10)));
	}

}

