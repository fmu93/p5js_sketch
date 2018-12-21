var ants = [];
var population;
var n = 20;
var mutationRate = 0.15;
var backOn = true;
var foodArray = [];
var maxFood = 60;
var foodColor;
var mateColor;
var foodLife = 70;
var foodRate = 20;

var buttonFft;
var mic, Fft, colorA, colorB;
var FftEnabled = false;
var xSound;

var buttonCircles;
var isCircles = false;
var butonFade;
var isFade = false;
var slider;
var sliderVal;

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

    foodColor = color('hsla(20, 80%, 50%, 0.7)');
    foodColorA = color('hsla(20, 80%, 50%, 0.15)');

    mateColor = color('hsla(260, 95%, 60%, 0.5)');
    mateColorA = color('hsla(260, 95%, 60%, 0.15)');

    population = new Population(mutationRate, n);

    while (foodArray.length < maxFood) {
        this.addFood(new Food());
    }

    // dom control
    buttonCircles = createButton('Show circles');
    buttonCircles.position(16, 8);
    buttonCircles.style('width', '130px');
    buttonCircles.mousePressed(showCircles);
    buttonFade = createButton('Show fade');
    buttonFade.position(16, 32);
    buttonFade.style('width', '130px');
    buttonFade.mousePressed(showFade);
    buttonFft = createButton('Show spectrogram');
    buttonFft.position(16, 56);
    buttonFft.style('width', '130px');
    buttonFft.mousePressed(showSpectrogram);
    slider = createSlider(0, 255, 100);
    slider.position(16, 80);
    slider.style('width', '130px');

}

function draw() {
    if (backOn) {
        if (isFade) {
            noStroke();
            fill('hsla(160, 80%, 0%, 0.03)');
            rect(0, 0, width * 2, height * 2);
        } else {
            background(0);
        }
    }

    if (FftEnabled) {
        visualizeFft();
    }

    if (frameCount % foodRate == 0 && foodArray.length < maxFood) {
        this.addFood();
    }

    population.run();
    showFood();

    getAudioContext().resume();
    sliderVal = slider.value();
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
    } else {
        FftEnabled = !FftEnabled;
    }
}

function addFood() {
    this.foodArray.push(new Food());
}