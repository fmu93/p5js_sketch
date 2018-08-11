// import processing.sound.*;

var systems;
var back = 0;
var backOn = true;

var k = 0;
var sound1;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(back);

  sound1 = loadSound('data/firework_sound.mp3');

  systems = []; 
  // createP('_____ Frank Croket > fco.muro2 (at) gmail.com');
}

function draw() {

  if (backOn) {
    background(back);
  }
  // glitter is what follows the mouse
  
  
  // manage explosions
  for(var i = systems.length - 1; i >= 0; i--) {
    var ps = systems[i];
    ps.run();
    if (ps.isDead()) {
     systems.splice(i, 1);
    }
  }

  // display current key
  textSize(18);
  fill(255);
  textAlign(CENTER);
  rectMode(CENTER);
  text("space bar and double click!", width/2, 30, 400, 30); 
}

function keyPressed() {
  if (key == " "){  
    background(back);
  }
}

function mousePressed() {
  explosion();
  sound1.play();
}

function doubleClicked() {
  backOn = !backOn;
  print("dsadas");
}

function explosion() {
  systems.push(new ParticleSystem(randomGaussian() + 25));
}
