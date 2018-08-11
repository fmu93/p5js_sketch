p5.disableFriendlyErrors = true; // performance

var n; 
var k;
var back;
var particles;

function setup() {

	k = 0;
	n = 420;
	back = 0;	
	particles = [];
	pixelate = 8;
	pixelateOn = false;

  createCanvas(windowWidth, windowHeight);           // set size to that of the image
  colorMode(HSB, 255);               // allows us to access the brightness of a color
  background(back);

  // Start particles
  for (var i = 0; i < n; i++) {
  	particles.push(new Particle());
  }
}

function draw() {
	background(back);

	// deal with each particle
	for (var i=0; i < particles.length; i++) {
		particles[i].wobble();
		particles[i].pointer();
   		// reaction among particles
	    for (var j=i+1; j < particles.length; j++) {
	   		particles[i].checkCollisionOther(particles[j]);
	    }
		particles[i].move();
	    particles[i].walls();
	   	particles[i].display(); 
	}

  // influence area
  noFill();
  stroke(back, 80);
  ellipse(mouseX, mouseY, height/2, height/2);
  
  // frame
  strokeWeight(30);
  stroke(back);
  noFill();
  rect(0,0,width,height);
  strokeWeight(1);

  // show framerate
  if ((k+1) % 50 == 0){
  	var fps = frameRate();
  	fill(255);
  	stroke(0);
  	textSize(12);
  	text("FPS: " + fps.toFixed(0), 10, height - 10);
  }
  k++;

  	// clicl me! text
	fill(255);
  	stroke(0);
  	textSize(16);
  	text("Click around!", 20, 12);
  
}


function mousePressed() {
	for (var i=0; i < particles.length; i++) {
		particles[i].s = particles[i].s * -1;
	}
}

