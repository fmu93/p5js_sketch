var mList = [];
var count = 200;

var hintText = "<click to add mushrooms>\n<spacebar to switch add mode>";

var mode = 0;
var time = 0;
var timeDot = 0.01;
var myShroom;
var spatialNoiseFactor = 0.003;
var std = 5;
var mean = 20;
var sineFactor = 0.35

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

    // hint text
    fill(120, 120);
    textAlign(CENTER);
    rectMode(CENTER);
    textSize(60);
    text(hintText, width / 2, 50);

    noStroke();
    for (var i = 0; i < mList.length; i++) {
        mList[i].display();
    }
    myShroom.pos = createVector(mouseX, mouseY);
    myShroom.display();

    time += timeDot;
}

function mouseDragged() {
    if (mode == 0) {
        mList.push(myShroom);
        myShroom = new Mushroom();
    }
}

function mouseClicked() {
    if (mode == 1) {
        mList.push(myShroom);
        myShroom = new Mushroom();
    }
}

function keyPressed() {
    if (key == ' ') {
        mode = (mode + 1) % 2;
        hintText = "<mode " + mode.toString() + ">";
    }
}

class Mushroom {
    constructor() {
        this.r = randomGaussian(mean, std);
        this.pos = createVector(random(this.r/2, width - this.r/2), random(this.r/2, height - this.r/2));
        this.maxBrightness = randomGaussian(255);
        this.minBrightness = 0;
        this.glowSpeed = randomGaussian(1, 1);
    }

    display() {
        var f = this.minBrightness + this.maxBrightness * noise(time, this.pos.x*spatialNoiseFactor, this.pos.y*spatialNoiseFactor)
        * (1 - sineFactor*sin(time * this.glowSpeed));
        fill(f);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
}
