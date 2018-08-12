
class Particle {
  
  constructor() {
    this.pos = createVector(mouseX, mouseY);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    
    this.zoom = (width+height)*0.00008;
    this.explosion = 2;
    this.c = color(255, 100 + 120*random(), 150 + random(20, 80));
    this.spikes = 4 + Math.floor(random(7));
    this.lifeSpan = randomGaussian(60, 70) + 210;
    this.size = this.lifeSpan*this.zoom;
    this.mass = this.lifeSpan*0.002; 
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
  
  update() {
    this.fade();
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifeSpan -= 0.5 + 2*noise(this.lifeSpan*this.spikes);
  }
  
  fade() {
    this.size = this.lifeSpan*this.zoom;
    this.c = color(red(this.c), green(this.c), blue(this.c), alpha(this.c) - randomGaussian());

    //mass = size/200; // actually more realistic but small bits fly too fast
  }
  
  display() {
    noStroke();
    fill(this.c);
    this.star(this.pos.x, this.pos.y, randomGaussian(0.5, 0.05)*this.size, randomGaussian(0.1, 0.05)*this.size/3, this.spikes);
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
