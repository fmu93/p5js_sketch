var ants = [];
var population;
var n = 10;
var mutationRate = 0.1;
var backOn = true;
var food = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    colorMode(HSL);

    population = new Population(mutationRate, n);
}

function draw() {
    if (backOn) background(0);

    if (frames % 1 == 0) {
        food.push(createVector(random(width), random(height)));
    }

    population.run();
    showFood();
}

function showFood() {
    for (var i = 0; i < food.length; i++) {
        noFill();
        stroke(100, 100, 50);
        ellipse(food[i].pos.x, food[i].pos.y, 8, 8);
    }
}

function mouseDragged() {
    population.addAnt(createVector(mouseX, mouseY));
}

function keyPressed() {
    if (key == ' ') {
        backOn = !backOn;
    }
}