function Particle() {
	this.pos = createVector(random() * width, random() * height);
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.size = random(6, 12);
	this.color = [random(0, 50), random(150, 230), random(120, 230)];
	this.maxspeed = 20/this.size;
	this.maxforce = 10;

	this.run = function() {
		this.update();
		this.wallsTeleport();
		this.display();
	}

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.display = function() {
		fill(this.color);
		noStroke();
		ellipse(this.pos.x, this.pos.y, this.size, this.size);
	}

	this.wallsTeleport = function() {
		if (this.pos.x > width) this.pos.x = 0;
		else if (this.pos.x < 0) this.pos.x = width;
		if (this.pos.y > height) this.pos.y = 0;
		else if (this.pos.y < 0) this.pos.y = height;

	}

}