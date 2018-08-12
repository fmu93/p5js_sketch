class GlitterParticle {

	GlitterParticle.prototype = Object.create(Particle.prototype);
	constructor() {
	  // super();
	  super.lifeSpan = randomGaussian(60, 40) + 100;
	}



}