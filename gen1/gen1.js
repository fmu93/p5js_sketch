var ants = [];
var population;
var n = 20;
var mutationRate = 0.1;
var backOn = true;
var food = [];
var maxFood = 50;
var foodColor;
var mateColor;
var foodLife = 70;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    colorMode(HSL);

    foodColor = color('hsla(20, 80%, 50%, 0.6)');
    foodColorA = color('hsla(20, 80%, 50%, 0.15)');

    mateColor = color('hsla(160, 80%, 50%, 0.6)');
    mateColorA = color('hsla(160, 80%, 50%, 0.15)');

    // personalColorA = color('hsla(320, 80%, 60%, 0.2)')

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
    strokeWeight(1);
    noFill();
    stroke(foodColor);

    for (var i = 0; i < food.length; i++) {
        ellipse(food[i].x, food[i].y, 8, 8);
    }
}

function mouseDragged() {
    var newAnt = new Ant(createVector(mouseX, mouseY));
    population.addAnt(newAnt);
}

function keyPressed() {
    if (key == ' ') {
        background(0);
        backOn = !backOn;
    }
}