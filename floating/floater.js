class Floater {
    constructor() {
        this.nodes = 100;
        this.pos = createVector(random(width), random(height));
        while (p5.Vector.dist(createVector(mouseX, mouseY), this.pos) < startDist) {
            this.pos = createVector(random(width), random(height));
        }
        this.r0 = random(20, 70);
        this.r = 0;
        this.toff = random(100);
        this.spikiness = random(0.01, 0.2);
        this.noisyness = random(0.2, 0.5);
        this.roughness = random(1, 2);
        this.spikes = floor(random(4, 20));
        this.deltat = random(0.02, 0.2);
        this.lifespan = random(200, 300);
        if (colorset == 1) {
            this.color = color(random(0, 100));
        } else {
            this.color = color(random(200, 255), random(0, 80), random(100, 150));
        }
        this.growspeed = random(3, 30);
    }

    update() {
        this.wander();
        this.walls();
        this.show();
        this.toff += this.deltat;
        this.lifespan -= 1;
        this.color.setAlpha(pow(this.lifespan, 1.1));
        if (this.r < this.r0) {
            this.r += this.growspeed;
        }
    }

    isDead() {
        return this.lifespan < 0;
    }

    isHit() {
        var hit = false;
        if (this.lifespan > 50) {
            hit = p5.Vector.dist(this.pos, createVector(mouseX, mouseY)) < this.r;
        }
        return hit
    }

    wander() {
        var go = createVector(noise(this.spikes + this.toff * 0.5), noise(this.toff * 0.5));
        go.sub(0.5, 0.5);
        go.mult(this.spikes * 1.5);
        this.pos.add(go);
    }

    walls() {
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        } else if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
        }
    }

    show() {
        fill(this.color);
        noStroke();
        push();
        translate(this.pos.x, this.pos.y);
        beginShape();
        for (var i = 0; i < this.nodes; i++) {
            var alphaoff = map(i, 0, this.nodes, 0, TWO_PI);
            var x_ = cos(alphaoff)
            var y_ = sin(alphaoff);

            var r1 = this.r * (1 + 0.12 * sin(this.toff) +
                this.spikiness * sin(this.spikes * alphaoff + this.toff) +
                this.noisyness * (noise(x_ + 0.5, y_ + 0.5, this.toff)) - 0.5);
            // var r1 = this.r;
            vertex(r1 * x_, r1 * y_);

        }

        endShape(CLOSE);
        pop();
    }
}