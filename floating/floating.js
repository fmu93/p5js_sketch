var floaters;
var limit = 100;
var colorset = 0;
var startDist = 200;
var topText = "<click>";
var bottomText = '';
var score = 0;
var record = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    //colorMode(HSB, 255);
    floaters = [];

}

function draw() {
    if (colorset == 1) {
        background(245);
    } else {
        background(0);
    }
    fill(120, 80);
    textAlign(CENTER);
    rectMode(CENTER);
    textSize(70);
    text(topText, width / 2, 60);
    text(bottomText, width / 2, height - 60);

    for (var i = floaters.length - 1; i >= 0; i--) {
        floaters[i].update();
        if (floaters[i].isDead()) {
            floaters.splice(i, 1);
            continue;
        }
        if (floaters[i].isHit()) {
            if (score > record) {
                record = score;
            }
            score = 0;
        }
    }
    if (floaters.length) score += 0.01 * floaters.length;
    bottomText = score.toFixed().toString() + "(" + record.toFixed().toString() + ")";

    if (mouseIsPressed) {
        addFloater();
    }

}

function addFloater() {
    if (floaters.length < limit) {
        floaters.push(new Floater());
    }
}

function keyPressed() {
    if (key == ' ') {
        colorset = (colorset + 1) % 2;
    }
}

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
            this.color = color(random(180, 255), random(0, 80), random(100, 180));
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
        go.mult(this.spikes * 2);
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
            var r1 = this.r * (1 + 0.12 * sin(this.toff) +
                this.spikiness * sin(this.spikes * alphaoff + this.toff) +
                this.noisyness * (noise(alphaoff, this.toff) + noise(this.roughness * alphaoff, this.toff)) - 0.5);
            // var r1 = this.r;
            vertex(r1 * cos(alphaoff), r1 * sin(alphaoff));

        }

        endShape(CLOSE);
        pop();
    }
}