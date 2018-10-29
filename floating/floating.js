var floaters;
var limit = 100;
var colorset = 0;
var startDist = 200;
var topText = "<click, spacebar>";
var topText2 = "<Avoid bubbles to score>"
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
    fill(120, 120);
    textAlign(CENTER);
    rectMode(CENTER);
    textSize(50);
    text(topText, width / 2, 50);
    textSize(25);
    text(topText2, width / 2, 80);
    textSize(80);
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
            if (score > 50) {
                colorset = (colorset + 1) % 2;
                floaters = [];
                score = 0;
                break;
            }
            score = 0;
        }
    }
    if (floaters.length) score += 0.01 * floaters.length;
    bottomText = score.toFixed().toString() + " (" + record.toFixed().toString() + ")";

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
