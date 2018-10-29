var mList = [];
var count = 16;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (var i = 0; i < count; i++) {
        mList.push(new Mushroom());
    }
}

function draw() {
    background(255);

    for (var i = 0; i < mList.length; i++) {
        mList[i].display();
    }
}

class Mushroom {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.r = random(80, 120);
        this.maxBrightness = 255;
        this.time = 0;
        this.glowSpeed = random(0.1, 0.3);
        this.timeDot = 0.01;

    }

    display() {
        var f = this.maxBrightness * noise(this.time, this.pos.x, this.pos.y) * (0.2 + 0.8*sin(this.time * this.glowSpeed * noise(this.time)));
        fill(f);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
        this.time += this.timeDot;
    }
}
