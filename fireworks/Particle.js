
class Particle {
  
  constructor() {
    this.pos = createVector(mouseX, mouseY);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    
    this.explosion = 2;
    this.c = color(255, 100 + 150*random(1), 150 + random(20, 100));
    this.spikes = 4 + Math.floor(random(4));
    this.lifeSpan = randomGaussian(60, 40) + 250;
    this.size = this.lifeSpan*0.1;
    this.mass = this.size/50; 
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
    this.lifeSpan -= 2;
  }
  
  fade() {
    this.size = this.lifeSpan*0.2; //*(noise(lifeSpan));
    this.c = color(red(this.c), green(this.c), blue(this.c), alpha(this.c) - 0.5)
    //mass = size/200; // actually more realistic but small bits fly too fast
  }
  
  display() {
    noStroke();
    fill(this.c);
    this.star(this.pos.x, this.pos.y, this.size, this.size/3, this.spikes);
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
