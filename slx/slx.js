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
var debug = false;
var mouseForceRadius;
var maxMouseForce;
var originalScale = 2000;
var scaler;

function preload() {
//   fontLight = loadFont('assets/Lato-Light.ttf');
  fontBold = loadFont('assets/Lato-Bold.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(225);
	frameRate(60);
	scaler = (2*width+height)/2/originalScale;
	mouseForceRadius = 150*scaler;
	maxMouseForce = -1*scaler;

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
		vpaths[j] = new Path(createVector(width/(nvPaths)*(j+0.5), 0), createVector(width/(nvPaths)*(j+0.5), height));
	}
	// create horizontal lines
	for (var k = 0; k < nhPaths; k++) {
		hpaths[k] = new Path(createVector(0, height/(nhPaths)*(k+0.5)), createVector(width, height/(nhPaths)*(k+0.5)));
	}

}

function draw() {
	background(225);
	if (debug) {
		flowField.display();
		//show paths			
		for (var j = 0; j < vpaths.length; j++) {
			vpaths[j].display();
		}
		for (var j = 0; j < hpaths.length; j++) {
			hpaths[j].display();
		}
		// mouse force
		noFill();
		ellipse(mouseX, mouseY, mouseForceRadius, mouseForceRadius);
	}
	
	// SLX text
	fill(190);
	noStroke();
	rectMode(CENTER)
	textSize(width/6);
	textStyle(BOLD);
	textFont(fontBold);
	textAlign(CENTER);
	text("SILEXICA", width/2, height*5/8);

	// current mouse position
	var mousePos = createVector(mouseX, mouseY);

	// particles
	for (var i = particles.length - 1; i > 0; i--) {
		// random force
		particles[i].applyForce(createVector(random(-0.15, 0.15), random(-0.15, 0.15)));

		// mouse force if within range
		var particleToMouse = p5.Vector.sub(mousePos, particles[i].pos);
		var mag = particleToMouse.mag();
		if (mag < mouseForceRadius) {
			particleToMouse.normalize();
			particleToMouse.mult(maxMouseForce*pow(map(mag, mouseForceRadius, 0, 0, 1), 2));
			particles[i].applyForce(particleToMouse);
		}

		// flowfield, line or seek force
		if (!ishSLX && !isvSLX) {
			particles[i].applyForce(flowField.lookup(particles[i].pos));
		} else if (isvSLX && !ishSLX) {
			// vertical lines (size)
			particles[i].follow(vpaths[particles[i].type2]);
		} else if (ishSLX && !isvSLX) {
			// horizontal lines (color)
			particles[i].follow(hpaths[particles[i].type1]);
		} else {
			var target = createVector(vpaths[particles[i].type2].start.x, hpaths[particles[i].type1].start.y);
			var toTarget = p5.Vector.sub(target, particles[i].pos);
			if (toTarget.mag() > (30 + particles[i].size)*scaler) {
				particles[i].seek(target);	
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

