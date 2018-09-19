function Particle() {

	this.type1 = floor(random(0, 4)); // color
	this.type2 = floor(random(0, 4)); // size
	this.colors = ['#56b2af', // lightest
        '#008E8C',
	'#008997', 
	'#006283']; 
// 	'#00495E']; // darkest
	this.sizes = [7, 10, 15, 19];
	this.color = color(this.colors[this.type1]);
	this.stroke = [0, 12];
	this.size = this.sizes[this.type2]*random(0.8, 1.2)*scaler;	
	this.maxspeed = map(this.type2, 0, 3, 3.5, 1.5)*random(0.8, 1.2)*scaler;
	this.maxforce = map(this.type1, 0, 3, 1.5, 0.3)*scaler;
	this.pos = createVector(Math.random() * width, Math.random() * height);
	this.vel = createVector(this.maxspeed, 0);
	this.acc = createVector(0, 0);

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

	// This function implements Craig Reynolds' path following algorithm
    // http://www.red3d.com/cwr/steer/PathFollow.html
    this.follow = function(p) {

        // Predict position some frames ahead
        var predict = this.vel.copy();
        predict.normalize();
        predict.mult(this.maxspeed*4);
        var predictpos = p5.Vector.add(this.pos, predict);

        // Look at the line segment
        var a = p.start;
        var b = p.end;

        // Get the normal point to that line
        var normalPoint = this.getNormalPoint(predictpos, a, b);

        // Find target point further ahead of normal depending on distance to line
        var normalVector = p5.Vector.sub(normalPoint, this.pos); 
        var dir = p5.Vector.sub(b, a);
        dir.normalize();
        dir.mult(pow(normalVector.mag(), 0.4)*20); 
        var target = p5.Vector.add(normalPoint, dir);

        // How far away are we from the path?
        var distance = p5.Vector.dist(predictpos, normalPoint);
        // Only if the distance is greater than the path's radius do we bother to steer
        if (distance > p.radius) {
          this.seek(target);
        }
    }

    // A function to get the normal point from a point (p) to a line segment (a-b)
    // This function could be optimized to make fewer new Vector objects
    this.getNormalPoint = function(p, a, b) {
        // Vector from a to p
        var ap = p5.Vector.sub(p, a);
        // Vector from a to b
        var ab = p5.Vector.sub(b, a);
        ab.normalize(); // Normalize the line
        // Project vector "diff" onto line by using the dot product
        ab.mult(ap.dot(ab));
        var normalPoint = p5.Vector.add(a, ab);
        return normalPoint;
    }
    
    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    this.seek = function(target) {
        var desired = p5.Vector.sub(target, this.pos);  // A vector pointing from the position to the target

        // If the magnitude of desired equals 0, skip out of here
        // (We could optimize this to check if x and y are 0 to avoid mag() square root
        if (desired.mag() == 0) return;

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus Velocity
        var steer = p5.Vector.sub(desired, this.vel);
        // steer.limit(this.maxforce);  // Limit to maximum steering force

        steer.limit(this.maxforce);
        this.applyForce(steer);
    }

    this.randomForce = function() {
        var force = createVector(Math.random()-0.5, Math.random()-0.5);
        force.mult(0.2);
        this.applyForce(force);
    }

	this.display = function() {
		fill(this.color);
		//stroke(this.stroke);
		//strokeWeight(1);
		ellipse(this.pos.x, this.pos.y, this.size, this.size);
	}

	this.wallsTeleport = function() {
		if (this.pos.x > width) this.pos.x = 0;
		else if (this.pos.x < 0) this.pos.x = width;
		if (this.pos.y > height) this.pos.y = 0;
		else if (this.pos.y < 0) this.pos.y = height;

	}

}
