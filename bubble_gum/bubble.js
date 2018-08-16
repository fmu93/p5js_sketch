function Bubble(x, y) {
	var options = {
		friction: 0.3, 
		restitution: 0.2,
		frictionAir: 0.02
	}
	this.r = randomGaussian(12, 3);
	this.body = Bodies.circle(x, y, this.r, options);
	this.c = color(random(90, 230), random(90, 230), random(90, 230));
	World.add(world, this.body);

	this.show = function() {
		var pos = this.body.position;
		var angle = this.body.angle;
		push();
		translate(pos.x, pos.y);
		noStroke();
		fill(this.c);
		ellipse(0, 0, this.r*2, this.r*2);
		pop();
	}


}