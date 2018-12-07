var ants = [];
var population;
var n = 10;
var mutationRate = 0.1;
var backOn = true;
var food = [];
var maxFood = 50;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    colorMode(HSL);

    population = new Population(mutationRate, n);
}

function draw() {
    if (backOn) background(0);

    if (frameCount % 5 == 0 && food.length < maxFood) {
        food.push(createVector(random(width), random(height)));
    }

    population.run();
    showFood();
}

function showFood() {
    for (var i = 0; i < food.length; i++) {
        noFill();
        stroke(200, 50, 5);
        ellipse(food[i].x, food[i].y, 8, 8);
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