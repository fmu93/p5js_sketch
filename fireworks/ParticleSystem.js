class ParticleSystem {
  
  constructor(n) {

    this.gravity = createVector(0, 0.02);
    this.explosionCoeff = 0.5;
    this.particles = [];
    for(var i = 0; i < n; i++) {
      var p = new Particle();
      this.particles.push(p);
    }
  }
  
  explosion(p) {
    var ex = createVector(randomGaussian()*0.5, randomGaussian()*0.5);
    ex.mult(this.explosionCoeff);
    p.applyForce(ex);
  }
  
  run() {
   for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    
    p.applyForce(this.gravity.mult(p.mass));
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
