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

  createCanvas(windowWidth, windowHeight);      // set size to that of the image
  colorMode(HSB, 255);               // allows us to access the brightness of a color
  background(back);

  // Start particles
  for (var i = 0; i < n; i++) {
  	particles.push(new Particle());
  }
}

function draw() {

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

  
  // frame
  strokeWeight(30);
  stroke(back);
  noFill();
  rect(1,1,width-1,height-1);
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

function doubleClicked() {
  background(back);
}

class Particle {

	constructor() {
		this.c = color(random(100, 255), random(100, 255), random(100, 255));
		this.pos = createVector(random(width), random(height));
		this.speed = createVector(0,0);
		this.size = int(width*random(0.002,0.01));
		this.friction = 0.967; 
		this.s = 0.08; // strength of pull
		this.w = 0.1; // wobblyness
		this.RInfluence = height/4; // radius of influence of force
	}

	checkCollisionOther(other) {
		var distV = p5.Vector.sub(this.pos, other.pos);
		if (distV.mag() < (other.size + this.size)/2.0) {
			var repel = distV.normalize().mult(this.w);
			this.speed.add(repel);
			other.speed.sub(repel);
		}
	}

	wobble() {
		this.speed.add(random(-this.w,this.w), random(-this.w,this.w));
	}

	pointer() {
		var mouse = createVector(mouseX, mouseY);
		var diff = mouse.sub(this.pos);
		if (this.RInfluence/diff.mag() >= 1) {
			//speed.add(diff.normalize().mult(s*(1/pow(diff.mag(), 1)))); 
			this.speed.add(diff.normalize().mult( this.s * pow(1 - diff.mag()/this.RInfluence, 0.5) )); 
	  	} 
	}

	move() {
	  this.pos.add(this.speed);
	  this.speed.mult(this.friction);   
	}

	walls() {
		if (this.pos.x > width) {
			this.pos.x = 0; 
		} else if (this.pos.x < 0) {
			this.pos.x = width;
		}
		if (this.pos.y > height) {
			this.pos.y = 0;
		} else if (this.pos.y < 0) {
			this.pos.y = height;
		}
	}

	display() {
		stroke(this.c);
		fill(this.c);
		ellipse(this.pos.x, this.pos.y, this.size, this.size);
	}

}
