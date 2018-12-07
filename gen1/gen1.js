var ants = [];
var population;
var n = 10;
var mutationRate = 0.1;
var backOn = true;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    colorMode(HSL);

    population = new Population(mutationRate, n);
}

function draw() {
    if (backOn) background(0);
    population.run();
}

function mouseDragged() {
    population.addAnt(createVector(mouseX, mouseY));
}

function keyPressed() {
    if (key == ' ') {
        backOn = !backOn;
    }
}