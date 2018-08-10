import processing.sound.*;
ArrayList<ParticleSystem> systems;
color back = color(0);
boolean backOn = true;

ArrayList<Particle> glitter = new ArrayList<Particle>();
int k = 0;

SoundFile sound1;

void setup() {
  size(1600, 1000);
  background(0);
  sound1 = new SoundFile(this, "firework_sound.mp3");
  sound1.amp(1);

  systems = new ArrayList<ParticleSystem>();
}

void draw() {
  if (backOn) background(0);
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
  text("space bar and double click!", 10, 30); 
}

void keyPressed() {
  if (key == ' '){  
    background(back);
  }
}

void mousePressed() {
  explosion();
  sound1.play();
}

void doubleClicked() {
  backOn = !backOn;
}

public void mouseClicked(MouseEvent evt) {
  if (evt.getCount() == 2)doubleClicked();
}

void explosion() {
  systems.add(new ParticleSystem(40));
}
