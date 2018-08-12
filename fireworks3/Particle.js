
class Particle {
  
  constructor() {
    this.pos = createVector(mouseX, mouseY);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.aAcc = 0;
    this.aVel = 0;
    this.angle = 0;
    
    this.zoom = (width+height)*0.00005;
    this.explosion = 2;
    this.c = color(0, 0);
    this.spikes = 4 + Math.floor(random(4));
    this.lifeSpan = randomGaussian(60, 40) + 250;
    this.size = this.lifeSpan*this.zoom;
    this.mass = this.lifeSpan*0.003; 
  }

  randomGold() {
  	this.c = color(210 + randomGaussian(20, 10), 180 + randomGaussian(50, 10), 50 + randomGaussian(100, 100));
  	return this.c;
  }
  
  isDead() {
    if (this.lifeSpan <= 0) {
      return true;
    } else {
      return false;
    }
  }
  
  applyForce(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  applyTorque(torque) {
    this.aAcc += torque/this.mass;
  }
  
  update() {
    this.fade();
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.aVel += this.aAcc;
    this.angle += this.aVel;
    this.aAcc = 0;

    this.lifeSpan -= 0.5 + 2*noise(this.lifeSpan*this.spikes);
  }
  
  fade() {
    this.size = this.lifeSpan*this.zoom;
    this.randomGold();
    this.c = color(red(this.c), green(this.c), blue(this.c), (this.lifeSpan) + randomGaussian(50, 100))
    //mass = size/200; // actually more realistic but small bits fly too fast
  }
  
  display() {
    noStroke();
    fill(this.c);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    this.star(0, 0, randomGaussian(0.5, 0.2)*this.size, randomGaussian(0.25, 0.05)*this.size/2, this.spikes);
    pop();  
  }
  
  star(x, y, radius1, radius2, npoints) {
    var angle = TWO_PI / npoints;
    var halfAngle = angle/2.0;
    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) {
      var sx = x + cos(a) * radius2;
      var sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a+halfAngle) * radius1;
      sy = y + sin(a+halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
  
  
  
}
