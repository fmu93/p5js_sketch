var ants = [];
var population;
var n = 20;
var mutationRate = 0.15;
var backOn = true;
var food = [];
var maxFood = 60;
var foodColor;
var mateColor;
var foodLife = 70;
var foodRate = 20;
var wallRepelSize = 0.01;

var mic, Fft, colorA, colorB;
var FftEnabled = true;
var xSound;

function setupFft() {
    colorA = color('hsla(0, 80%, 50%, 0.2)');
    colorB = color('hsla(255, 80%, 50%, 0.2)');
    mic = new p5.AudioIn();
    mic.start();
    Fft = new p5.FFT();
    Fft.setInput(mic);
}

function visualizeFft() {
    var spectrum = Fft.analyze();
    var rand = random(0.9, 1.1);
    for (var i = 0; i < spectrum.length; i += 5) {
        var amt = map(i, 0, spectrum.length, 0, 1);
        var color = lerpColor(colorA, colorB, amt);
        var diam = map(spectrum[i], 0, 255, 0, windowHeight);
        noFill();
        stroke(color);
        ellipseMode(CENTER);
        ellipse(width / 2, height / 2, diam * rand, diam * rand);
    }
}

function setup() {
    setupFft();

    createCanvas(windowWidth, windowHeight);
    background(0);
    colorMode(HSL);
    textSize(18);
    textAlign(CENTER, CENTER);

    foodColor = color('hsla(20, 80%, 50%, 0.6)');
    foodColorA = color('hsla(20, 80%, 50%, 0.05)');

    mateColor = color('hsla(350, 80%, 80%, 0.6)');
    mateColorA = color('hsla(250, 95%, 60%, 0.3)');

    // personalColorA = color('hsla(320, 80%, 60%, 0.2)')

    population = new Population(mutationRate, n);



    while (food.length < maxFood) {
        this.addFood(createVector(random(width), random(height)));
    }
}

function draw() {
    if (backOn) {
        // background(0);
        noStroke();
        fill('hsla(160, 80%, 0%, 0.03)');
        rect(0, 0, width * 2, height * 2);
    }

    if (FftEnabled) {
        visualizeFft();
    }

    if (frameCount % foodRate == 0 && food.length < maxFood) {
        this.addFood(createVector(random(width), random(height)));
    }

    population.run();
    showFood();

    getAudioContext().resume();
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
    } else {
        FftEnabled = !FftEnabled;
    }
}

function addFood(pos_) {
    this.food.push(pos_);
}