var ants = [];
var population;
var n = 25;
var mutationRate = 0.15;
var foodArray = [];
var maxFood = 50;
var foodColor;
var mateColor;
var foodLife = 60;
var foodRate = 15;

var buttonFft;
var mic, Fft, colorA, colorB;
var FftEnabled = false;
var xSound;

var buttonCircles;
var isCircles = false;
var buttonFade;
var isFade = false;
var buttonBack;
var backOn = true;
var slider;

function setupFft() {
    colorA = color('hsla(0, 80%, 50%, 0.3)');
    colorB = color('hsla(255, 80%, 50%, 0.3)');
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
    colorMode(HSL, 360, 100, 100);
    textSize(18);
    textAlign(CENTER, CENTER);

    foodColor = color('hsla(20, 80%, 50%, 0.6)');
    foodColorA = color('hsla(20, 80%, 50%, 0.15)');

    mateColor = color('hsla(240, 100%, 40%, 0.5)');
    mateColorA = color('hsla(240, 100%, 40%, 0.15)');

    population = new Population(mutationRate, n);

    while (foodArray.length < maxFood) {
        this.addFood();
    }

    // dom control
    setButtons();

}

function draw() {
    if (backOn) {
        if (isFade) {
            noStroke();
            fill('hsla(160, 80%, 0%, 0.05)');
            rect(0, 0, width * 2, height * 2);
        } else {
            background(0);
        }

        showFood();
    }

    if (FftEnabled) {
        visualizeFft();
    }

    if (frameCount % foodRate == 0) {
        this.addFood();
    }

    population.run();

    getAudioContext().resume();
    if (slider.value() / 100 != mutationRate) {
        mutationRate = slider.value() / 100;
        // sliderLabel = createP("Mutation rate: " + mutationRate.toString());
    }
}

function showFood() {
    strokeWeight(2);
    noFill();
    if (isFade) {
        stroke(foodColorA);
    } else {
        stroke(foodColor);
    }

    for (var i = 0; i < foodArray.length; i++) {
        ellipse(foodArray[i].pos.x, foodArray[i].pos.y, 8, 8);
    }
}

function mouseDragged() {
    if (mouseX > 250 || mouseY > 150) {
        var newAnt = new Ant(createVector(mouseX, mouseY));
        population.addAnt(newAnt);
    }
}

function keyPressed() {
    if (key == ' ') {
        background(0);
        backOn = !backOn;
    }
}

function addFood(pos_) {
    if (foodArray.length < maxFood) {
        var newFood = new Food(pos_)
        this.foodArray.push(newFood);
    }
}

function setButtons() {
    // sight circles
    buttonCircles = createButton('Show sight');
    buttonCircles.position(16, 8);
    buttonCircles.style('width', '130px');
    buttonCircles.mousePressed(showCircles);
    // fade button
    buttonFade = createButton('Fade footprint');
    buttonFade.position(16, 32);
    buttonFade.style('width', '130px');
    buttonFade.mousePressed(showFade);
    // spectrogram 
    buttonFft = createButton('Show spectrogram');
    buttonFft.position(16, 56);
    buttonFft.style('width', '130px');
    buttonFft.mousePressed(showSpectrogram);
    // background
    buttonBack = createButton('Only relations');
    buttonBack.position(16, 80);
    buttonBack.style('width', '130px');
    buttonBack.mousePressed(showBackground);
    // slider
    sliderLabel = createP("Mutation rate: ");
    sliderLabel.position(16, 88);
    sliderLabel.style('color', '#ffffff');
    slider = createSlider(0, 100, mutationRate * 100);
    slider.position(16, 118);
    slider.style('width', '130px');
}

function showBackground() {
    background(0);
    backOn = !backOn;
}

function showCircles() {
    isCircles = !isCircles;
}

function showSpectrogram() {
    FftEnabled = !FftEnabled;
}

function showFade() {
    isFade = !isFade;
}