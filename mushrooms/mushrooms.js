var mList = [];
var count = 400;
var time = 0;
var timeDot = 0.01;
var myShroom;
var spatialNoiseFactor = 0.004;
var std = 5;
var mean = 20;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (var i = 0; i < count; i++) {
        mList.push(new Mushroom());
    }
    myShroom = new Mushroom();
    noCursor();
}

function draw() {
    background(0);
    noStroke();
    for (var i = 0; i < mList.length; i++) {
        mList[i].display();
    }
    myShroom.pos = createVector(mouseX, mouseY);
    myShroom.display();

    time += timeDot;
}

class Mushroom {
    constructor() {
        this.r = randomGaussian(mean, std);
        this.pos = createVector(random(this.r/2, width - this.r/2), random(this.r/2, height - this.r/2));
        this.maxBrightness = randomGaussian(240);
        this.minBrightness = randomGaussian(0, 10);
        this.glowSpeed = randomGaussian(1, 0.1);
    }

    display() {
        var f = this.minBrightness + this.maxBrightness * noise(time, this.pos.x*spatialNoiseFactor, this.pos.y*spatialNoiseFactor)
        * (0.6 + 0.4*sin(time * this.glowSpeed));
        fill(f);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
}
