class ParticleSystem {
  
  constructor(n) {

    this.gravity = createVector(0, 2);
    this.exMean = 1.2;
    this.exStDev = 0.4;
    this.particles = [];
    for(var i = 0; i < n; i++) {
      var p = new Particle();
      this.explosion(p);
      this.particles.push(p);
    }
  }
  
  explosion(p) {
    var ex = createVector(0.5 + randomGaussian(this.exMean, this.exStDev), 0);
    ex.rotate(random(TWO_PI));
    p.applyForce(ex);
  }
  
  run() {
   for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    
    p.applyForce(this.gravity.mult(p.mass));
    // this.explosion(p);
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
