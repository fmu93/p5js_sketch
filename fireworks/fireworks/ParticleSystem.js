class ParticleSystem {
  
  constructor(n) {

    this.gravity = createVector(0, 0.02);
    this.particles = [];
    for(var i = 0; i < n; i++) {
      this.particles.push(new Particle());
    }
  }
  
  explosion(p) {
    var ex = createVector(randomGaussian()*0.5, randomGaussian()*0.5);
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
