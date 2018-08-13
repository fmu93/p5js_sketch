class GlitterParticle extends Particle {
	
	constructor() {
	  super();
	  this.lifeSpan = randomGaussian(60, 40) + 200;
	}

	glitterColor() {
		this.c = color(210 + randomGaussian(20, 50), 20 + randomGaussian(50, 50), 50 + randomGaussian(30, 50), 200);
		this.spikes = 4 + Math.floor(random(4));
		this.angle = random(TWO_PI);
	}

	update() {
    this.fade();
    this.lifeSpan -= 2 + 4*noise(this.lifeSpan*this.spikes);
  }

    fade() {
    this.size = this.lifeSpan*this.zoom*0.7;
    this.glitterColor();
  }
}