class ParticleSystem {
  
  constructor(n) {


    this.gravity = createVector(0, 0.02);
    this.exMean = 2;
    this.exStDev = 0.4;
    this.dragCoeff = 0.002;
    this.particles = [];
    for(var i = 0; i < n; i++) {
      var p = new Particle();
      this.particles.push(p);
    }
  }
  
  explosion(p) {
    var ex = createVector(randomGaussian(this.exMean, this.exStDev), 0);
    ex.rotate(random(TWO_PI));
    p.applyForce(ex);
  }

  drag(p) {
    // drag
    var drag = p.vel.copy();
    drag.normalize();
    drag.mult(-1 * this.dragCoeff * p.vel.magSq() * p.mass);
    p.applyForce(drag);
  }

  gravityApply(p) {
    // gravity force
    var g = this.gravity.copy();
    g.mult(p.mass);
    p.applyForce(g);
  }
  
  run() {
   for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    this.gravityApply(p);
    // drag force
    this.drag(p);
    // update

    this.explosion(p);
    p.update();
    p.display();
    
    if (p.isDead()) {
     this.particles.splice(i, 1);
    }
   }  
  }
  
  isDead() {
   if (this.particles.length == 0) {
    return true; 
   } else {
     return false;
   }
  }
  
  
}
