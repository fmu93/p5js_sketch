var floaters;
var limit = 100;

function setup() {
    createCanvas(windowWidth, windowHeight);
    //colorMode(HSB, 255);
    floaters = [];
}

function draw() {
    background(0);

    for (var i = floaters.length - 1; i > 0; i--) {
        floaters[i].update();
        if (floaters[i].isDead()) {
            floaters.splice(i, 1);
        }
    }

    if (mouseIsPressed) {
        addFloater();
    }

}

function addFloater() {
    if (floaters.length < limit) {
        floaters.push(new Floater());
    }
}

class Floater {
    constructor() {
        this.nodes = 100;
        this.pos = createVector(random(width), random(height));
        this.r = random(20, 80);
        this.toff = random(100);
        this.spikiness = random(0.01, 0.2);
        this.noisyness = random(0.2, 0.5);
        this.roughness = random(1, 2);
        this.spikes = floor(random(4, 20));
        this.deltat = random(0.02, 0.2);
        this.lifespan = random(200, 300);
        this.color = color(random(200, 255), random(0, 40), random(100, 180));
    }

    update() {
        //this.pos = createVector(mouseX, mouseY);
        this.wander();
        this.walls();
        this.show();
        this.toff += this.deltat;
        this.lifespan -= 1;
        this.color.setAlpha(pow(this.lifespan, 1.1));
    }

    isDead() {
        return this.lifespan < 0;
    }

    wander() {
        var go = createVector(noise(this.spikes + this.toff*0.5), noise(this.toff*0.5));
        go.sub(0.5, 0.5);
        go.mult(this.spikes*2);
        this.pos.add(go);
    }

    walls() {
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < - this.r) {
            this.pos.x = width + this.r;
        } else if (this.pos.y > height + this.r) {
            this.pos.y = - this.r;
        } else if (this.pos.y <  -this.r) {
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
            var r1 = this.r * (1
                + this.spikiness * sin(this.spikes * alphaoff + this.toff)
                + this.noisyness * (noise(alphaoff, this.toff) + noise(this.roughness*alphaoff, this.toff)) -0.5);
            // var r1 = this.r;
            vertex(r1 * cos(i * TWO_PI / this.nodes), r1 * sin(i * TWO_PI / this.nodes));

        }

        endShape(CLOSE);
        pop();
    }
}