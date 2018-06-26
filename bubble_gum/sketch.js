var n; 
var k;
var back;
var particles;
var pixelate;
var pixelateOn;

function setup() {

	k = 0;
	n = 420;
	back = 0;	
	particles = [];
	pixelate = 8;
	pixelateOn = false;

  createCanvas(600, 600);           // set size to that of the image
  colorMode(HSB, 255);               // allows us to access the brightness of a color
  background(back);

  // Start particles
  for (var i = 0; i < n; i++) {
  	particles.push(new Particle());
  }
}

function draw() {
	background(back);

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
  
  // pixelate
  if (pixelateOn) {
  	pixelateImage(pixelate);
    //filter(INVERT);
	}

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
  
}

function keyPressed() {
	pixelateOn = !pixelateOn;
}

function mousePressed() {
	for (var i=0; i < particles.length; i++) {
		particles[i].s = particles[i].s * -1;
	}
}

function pixelateImage(pxSize) {

  // use ratio of height/width...
  var ratio;
  if (width < height) {
  	ratio = height/width;
  }
  else {
  	ratio = width/height;
  }
  
  // ... to set pixel height
  var pxH = (pxSize * ratio);
  loadPixels();
  
  noStroke();
  for (var x=0; x<width; x+=pxSize) {
  	for (var y=0; y<height; y+=pxH) {
  		fill(pixels[x + y*width]);
  		rect(x, y, pxSize, pxH);
  	}
  }
}

class Particle {
	constructor() {
		this.c = color(random(100, 255), random(100, 255), random(100, 255));
		this.pos = createVector(random(width), random(height));
		this.speed = createVector(0,0);
		this.weight = pow(size, 2);
		this.size = int(width*random(0.01,0.03)); // just a pixel
		this.friction = 0.967; 
		this.s = 0.08; // strength of pull
		this.w = 0.1; // wobblyness
		this.RInfluence = height/4; // radius of influence of force
	}

	checkCollisionOther(other) {
		// var distV = this.pos.sub(other.pos);
		// if (distV.mag() < (other.size + this.size)/2.0) {
		// 	var repel = distV.normalize().mult(this.w);
		// 	this.speed.add(repel);
		// 	other.speed.sub(repel);
		// }
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