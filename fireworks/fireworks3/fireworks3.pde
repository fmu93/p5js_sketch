import processing.sound.*;
ArrayList<ParticleSystem> systems;

ArrayList<Particle> glitter = new ArrayList<Particle>();
int k = 0;

// initial fireworks case parameters
char currentKey = '1';
int totalParticles = 840;
int n;
float size;
float[] speedRange;
int[] spikeRange;
float decay;
float gravity;
float fade;

// glitter parameters
int glitterCount = 50;
float gSize = 10.0;
float[] gSpeedRange = {0.5, 2};
int[] gSpikeRange = {3, 8};
float gFade = 0.4;

SoundFile sound1;

void setup() {
  size(1600, 1000);
  background(0);
  sound1 = new SoundFile(this, "firework_sound.mp3");
  sound1.amp(1);

  systems = new ArrayList<ParticleSystem>();
  setKey('1');
}

void draw() {
  background(0);
  // glitter is what follows the mouse
  
  
  // manage explosions
  for(int i = systems.size() - 1; i >= 0; i--) {
    ParticleSystem ps = systems.get(i);
    ps.run();
    if (ps.isDead()) {
     systems.remove(i);
    }
  }

  // display current key
  textSize(32);
  fill(255);
  text(currentKey, 10, 30); 
}

void keyPressed() {
  setKey(key);   
}

void setKey(char newKey) {
  currentKey = newKey;
  
  if (currentKey == '1') {
    size = 30;
    n = 50;
    speedRange = new float[] {0.5, 2};
    spikeRange = new int[] {3, 8};
    decay = 0.99;
    gravity = 0.03;
    fade = 0.2;
  } else if (currentKey == '2') {
    size = 10;
    n = 200;
    speedRange = new float[] {0.5, 2};
    spikeRange = new int[] {3, 8};
    decay = 0.98;
    //gravity = 0.02;
    fade = 0.1;
  } else if (currentKey == '3') {
    size = 10;
    n = 200;
    speedRange = new float[] {0.5, 4};
    spikeRange = new int[] {8, 20};
    decay = 0.98;
    //gravity = 0.02;
    fade = 0.3;
  } else if (currentKey == '4') {
    size = 5;
    n = 200;
    speedRange = new float[] {1, 4};
    spikeRange = new int[] {3, 8};
    decay = 0.98;
    //gravity = 0.04;
    fade = 0.1;
  } else if (currentKey == '5') {
    size = 20;
    n = 100;
    speedRange = new float[] {0.5, 8};
    spikeRange = new int[] {3, 8};
    decay = 0.95;
    //gravity = 0.02;
    fade = 0.9;
  }
}

void mousePressed() {
  explosion();
  sound1.play();
}

void explosion() {
  systems.add(new ParticleSystem(40));
}
