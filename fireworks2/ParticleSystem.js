class ParticleSystem {
  
  constructor(n) {

    this.gravity = createVector(0, 0.007);
    this.exMean = 1;
    this.exStDev = 0.4;
    this.dragCoeff = 0.003;
    this.torqueCoeff = 0.01;
    this.particles = [];
    for(var i = 0; i < n; i++) {
      var p = new Particle();
      this.explosion(p);
      this.randomTorque(p);
      this.particles.push(p);
    }
  }
  
  explosion(p) {
    var ex = createVector(0.1 + randomGaussian(this.exMean, this.exStDev), 0);
    ex.rotate(random(TWO_PI));
    p.applyForce(ex);
  }

  randomTorque(p) {
    var t = randomGaussian(0.5)*this.torqueCoeff;
    p.applyTorque(t);
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
