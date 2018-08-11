
class Particle {

	constructor() {
		this.c = color(random(100, 255), random(100, 255), random(100, 255));
		this.pos = createVector(random(width), random(height));
		this.speed = createVector(0,0);
		this.size = int((width+height)/2*random(0.01,0.03));
		this.friction = 0.98; 
		this.s = 0.08; // strength of pull
		this.w = 0.05; // wobblyness
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
