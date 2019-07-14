
var worm;
var pos;


function setup() {
    frameRate(5);
    createCanvas(windowWidth, windowHeight);
    background(0);
    colorMode(HSB, 360, 100, 100, 100);

    pos = createVector(random(width), random(height));
    worm = new Worm(pos);
}

function draw() {
    background(0);

    worm.update(pos);
    worm.show();

    pos.add(0.5, 0.5);
}