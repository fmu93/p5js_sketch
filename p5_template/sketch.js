// declare
var spots;
var play;
var chosen_spot;
var is_magic;
var numSpots; // Number of objects
var panelB;
var j;
var bSpeed;

function setup() {
    // assign
    play = false;
    chosen_spot = 1;
    is_magic = false;
    numSpots = 12; // Number of objects
    spots = []; 
    j = 0;
    bSpeed = 0.5;
    var magic_chance = 5;
    // setup
  createCanvas(1200, 600);
//  frameRate(200);
  var dia = width/2/numSpots; // Calculate diameter
//  spots = new Spot[numSpots]; // Create array
  for (var i = 0; i < numSpots; i++) {
    var x = dia/2 + i*dia;
    var y = random(dia/2.0, height-dia/2.0);
    var rate = random(0.3, 3.0)*(round(random(0.0, 1.0))-0.5)*2;
     // Create each object
    spots[i] = new Spot(x, y, dia, rate);
  }
  chosen_spot = round(random(0, numSpots));
  if (random(0, magic_chance) < 1) {
    is_magic = true;
  }

  fill(0);
  rect(0, 0, width/2, height);
  noFill();
  stroke(0);
  rect(0, 0, width-1, height-1);
  noStroke();

}

function draw() {
  if (play == true) {
    fill(0, 12);
    noStroke();
    rect(0, 0, width/2, height);
    j = (j % height) + bSpeed;
  }else{
      noFill();
      stroke(0);
      rect(0, 0, width/2, height);
      fill(255);
      textSize(100);
      text("PLAY", width/4, height/2);
  }
    stroke(255);
    noFill();
    rect(0+1,height/2-1,width/2-1,3);
    noStroke();
  for (var i=0; i < spots.length; i++) {
    if (play == true) {
      noFill();
      stroke(255,255,255);
      if (i == chosen_spot && is_magic){
        stroke(255, 0, 0);
      }
      spots[i].move(); // Move each object
      spots[i].display(); // Display each object
    }
  }
    // make panelB
    panelB = get(1, height/2,width/2-1,1);
    // blend(panelB, 1, height/2,width/2-1,1, width/2, j, width/2, 1, BURN);
    image(panelB, width/2+1, j);
    //copy(0,height/2,width/2,1, width/2,0,width/2,height);
    
    // Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
    if ((j+1) % 20 == 0){
        var fps = frameRate();
        fill(255);
        stroke(0);
        textSize(12);
        text("FPS: " + fps.toFixed(0), 10, height - 10);
    }
}

function touchStarted(){
  play = !play;
}

class Spot {
    constructor(xpos, ypos, dia, sp){
    this.x = xpos;
    this.y = ypos;
    this.diameter = dia;
    this.speed = sp;
    this.directionY = random(-1,1);  // Direction of motion (1 is down, -1 is up)
    this.directionX = random(-1,1);  // Direction of motion (1 is down, -1 is up)
    }
    
      move() {
        this.y += (this.speed * this.directionY); 
        if ((this.y > (height - this.diameter/2)) || (this.y < this.diameter/2)) { 
          this.directionY *= -1; 
        }
        this.x += (this.speed * this.directionX); 
        if ((this.x > (width/2 - this.diameter/2)) || (this.x < this.diameter/2)) { 
          this.directionX *= -1; 
        }
      }

      display() {
        ellipse(this.x, this.y, this.diameter, this.diameter);
      }
}
