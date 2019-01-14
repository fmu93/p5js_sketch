var mList = [];
var count = 300;

var hintText = "<drag to add mushrooms>\n<spacebar to switch paint mode>"; // \n<double click to speed>";

var mode = 2;
var time = 0;
var timeDot = 0.01;
var myShroom;
var spatialNoiseFactor = 0.003;
var std = 5;
var mean = 20;
var sprayCount = 6;
var sprayR;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 100);

    for (var i = 0; i < count; i++) {
        mList.push(new Mushroom());
    }
    myShroom = new Mushroom();
    noCursor();

    sprayR = width / 12;
}

function draw() {
    background(0);

    // hint text
    fill(255, 50);
    textAlign(CENTER);
    rectMode(CENTER);
    textSize(60);
    text(hintText, width / 2, 50);

    noStroke();
    for (var i = mList.length - 1; i > 0; i--) {
        mList[i].update();
        if (mList.length > 100 && mList[i].isDead()) {
            mList.splice(i, 1);
        }
    }
    myShroom.pos = createVector(mouseX, mouseY);
    myShroom.displayWhite();

    time += timeDot;
}

function mouseDragged() {
    if (mode == 0) {
        plantMushroom(createVector(mouseX, mouseY));
    } else if (mode == 2) {
        for (var i = 0; i < sprayCount; i++) {
            plantMushroom(createVector(mouseX + random(-sprayR, sprayR), mouseY + random(-sprayR, sprayR)));
        }
    }
}

function mouseClicked() {
    if (mode == 1) {
        plantMushroom(createVector(mouseX, mouseY));
    }
}

function plantMushroom(newPos) {
    mList.push(new Mushroom(newPos));
    myShroom = new Mushroom();
    hintText = "";
    timeDot = 0.4/frameRate();
}

// function doubleClicked() {
//     timeDot += 0.02;
//     if (timeDot > 0.2) timeDot = 0.01;
//     hintText = "<speed " + timeDot.toPrecision(1) + ">";
// }

function keyPressed() {
    if (key == ' ') {
        mode = (mode + 1) % 3;
        hintText = "<mode " + mode.toString() + ">";
    }
}

class Mushroom {
    constructor(_pos) {
        this.r = randomGaussian(mean, std);
        if (_pos) {
            this.pos = _pos;
        } else {
            this.pos = createVector(random(this.r/2, width - this.r/2), random(this.r/2, height - this.r/2));
        }
        this.maxBrightness = randomGaussian(120);
        this.minBrightness = -50;
        this.glowSpeed = randomGaussian(pow(abs(width/2 - this.pos.x)/500, 2));
        this.off = random(10);
        this.sineFactor = 0.3 + map(abs(height/2 - this.pos.y), 0, height/2, 0.3, 0);
        this.color = color(random(0, 360), 90, 80);
        this.f = 0;
        this.life = randomGaussian(2700, 800);
    }

    update() {
        this.move();
        this.age();
        this.display();
    }

    display() {
        var factor = noise(time, this.pos.x*spatialNoiseFactor, this.pos.y*spatialNoiseFactor)
        * (1 - this.sineFactor*sin(this.off + time * this.glowSpeed));
        this.f = map(factor, 0, 1, this.minBrightness, this.maxBrightness);
        this.color.setAlpha(this.f);
        this.color.setGreen(map(factor, 0, 1, 30, 240));
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }

    displayWhite() {
        fill(200, 0, 100);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }

    move() {
        this.pos.add(random(-1, 1), random(-1, 1));
    }

    age() {
        this.life--;
    }

    isDead() {
        return this.life < 0;
    }
}
