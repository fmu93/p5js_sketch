
var systems;
var glitter;
var back = 0;
var backOn = false;

var k = 0;
var sound1;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(back);

  sound1 = loadSound('data/firework_sound.mp3');

  systems = []; 
  glitter = [];
}

function draw() {

  if (backOn) {
    background(back);
  } else {
    noStroke();
    fill(0, 3);
    rect(0, 0, width*2, height*2);
  }
  // glitter is what follows the mouse
  var glitterParticle = new GlitterParticle();
  glitter.push(glitterParticle);
  for(var i = glitter.length - 1; i >= 0; i--) {
  	var p = glitter[i];
    p.update();
    p.display();
    if (p.isDead()) {
     glitter.splice(i, 1);
    }
  }
  
  
  // manage explosions
  for(var i = systems.length - 1; i >= 0; i--) {
    var ps = systems[i];
    ps.run();
    if (ps.isDead()) {
     systems.splice(i, 1);
    }
  }

  // display current key

  textAlign(CENTER);
  rectMode(CENTER);
  fill(back);
  rect(width/2, 25, 300, 30);
    textSize(18);               
  fill(255);
  text("space bar and double click!", width/2, 30, 350, 30); 
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
}

function explosion() {
  var ps = new ParticleSystem(randomGaussian(10) + 40);
  ps.explosion();
  ps.randomTorque();
  systems.push(ps);
}
