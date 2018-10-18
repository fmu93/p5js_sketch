p5.disableFriendlyErrors = true; // disables FES

var particles = [];
var nParticles; 
var flowField;
var hpaths = [];
var nhPaths = 4;
var vpaths = [];
var nvPaths = 4;
var ishSLX = false;
var isvSLX = false;
var nclicks = 0;
var debug = false;
var mouseForceRadiusSq;
var originalScale = 1800;
var scaler;

function preload() {
<<<<<<< HEAD
	//   fontLight = loadFont('assets/Lato-Light.ttf');
	fontBold = loadFont('assets/Lato-Bold.ttf');
=======
  fontLight = loadFont('assets/Lato-Light.ttf');
  //fontBold = loadFont('assets/Lato-Bold.ttf');
>>>>>>> 528e6c850086c7a63f1a70794035de62d2a8cf9a
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(225);
	// frameRate(40);
	scaler = (width + height) / originalScale;
	mouseForceRadiusSq = pow(100 * scaler, 2);
	nParticles = 1011;

	for (var i = 0; i < nParticles; i++) {
		particles[i] = new Particle();
<<<<<<< HEAD
		if (i % 100 == 0) {
=======
		if (i%111 == 0) {
>>>>>>> 528e6c850086c7a63f1a70794035de62d2a8cf9a
			particles[i].color = [0, 0];
			particles[i].stroke = [0, 0];
		}
	}
	// // sort by color (type1)
	// particles.sort(function(a, b){
	//     return a.type1 - b.type1;
	// });

	flowField = new FlowField();
	flowField.init();

	// create vertical lines
	for (var j = 0; j < nvPaths; j++) {
		vpaths[j] = new Path(createVector(width / (nvPaths) * (j + 0.5), 0), createVector(width / (nvPaths) * (j + 0.5), height));
	}
	// create horizontal lines
	for (var k = 0; k < nhPaths; k++) {
		hpaths[k] = new Path(createVector(0, height / (nhPaths) * (k + 0.5)), createVector(width, height / (nhPaths) * (k + 0.5)));
	}

<<<<<<< HEAD
	particles[nParticles - 1].color = [0, 0];
	particles[nParticles - 1].stroke = [0, 0];
=======
	//particles[nParticles-1].color = [0, 0];
	//particles[nParticles-1].stroke = [0, 0];
>>>>>>> 528e6c850086c7a63f1a70794035de62d2a8cf9a

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
	textSize(width / 6);
	textStyle(BOLD);
	textFont(fontLight);
	textAlign(CENTER);
	text("SILEXICA", width / 2, height * 5 / 8);

	// current mouse position
	var mousePos = createVector(mouseX, mouseY);

	// stroke(0, 12);

	// particles
	for (var i = particles.length - 1; i > 0; i--) {
		// random force
		particles[i].randomForce();

		// mouse force if within range
		var mouseToParticle = p5.Vector.sub(particles[i].pos, mousePos);
		var magSq = mouseToParticle.magSq();
		if (magSq < mouseForceRadiusSq) {
			mouseToParticle.normalize();
			mouseToParticle.mult(map(magSq, mouseForceRadiusSq, 0, 0, particles[i].maxforce));
			particles[i].applyForce(mouseToParticle);
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
			if (toTarget.magSq() > pow(30 + particles[i].size, 2) * scaler) {
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

	nclicks = (nclicks + 1) % 4

	for (var i = particles.length - 1; i > 0; i--) {
		particles[i].applyForce(createVector(Math.random(-10, 10), Math.random(-10, 10)));
	}

}