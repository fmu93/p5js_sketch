// import processing.sound.*;

var systems;
var back = 0;
var backOn = true;

var k = 0;

// SoundFile sound1;

function setup() {
  createCanvas(1600, 1000);
  background(0);
  // sound1 = new SoundFile(this, "firework_sound.mp3");
  // sound1.amp(1);

  systems = [];
}

function draw() {
  if (backOn) background(0);
  // glitter is what follows the mouse
  
  
  // manage explosions
  for(var i = systems.length - 1; i >= 0; i--) {
    var ps = systems[i];
    ps.run();
    if (ps.isDead()) {
     systems.remove(i);
    }
  }

  // display current key
  textSize(32);
  fill(255);
  text("space bar and double click!", 10, 30); 
}

function keyPressed() {
  if (key == ' '){  
    background(back);
  }
}

function mousePressed() {
  explosion();
  // sound1.play();
}

function doubleClicked() {
  background(back);
}

function doubleClicked() {
  backOn = !backOn;
}

function explosion() {
  systems.push(new ParticleSystem(40));
}
