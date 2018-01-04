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
    play = true;
    chosen_spot = 1;
    is_magic = false;
    numSpots = 20; // Number of objects
    spots = []; 
    j = 0;
    bSpeed = 0.5;
    // setup
  createCanvas(800, 400);
  var magic_chance = 7;
  var dia = width/2/numSpots; // Calculate diameter
//  spots = new Spot[numSpots]; // Create array
  for (var i = 0; i < numSpots; i++) {
    var x = dia/2 + i*dia;
    var y = random(dia/2.0, height-dia/2.0);
    var rate = random(0.2, 2.0)*(round(random(0.0, 1.0))-0.5)*2;
     // Create each object
    spots[i] = new Spot(x, y, dia, rate);
  }
  chosen_spot = round(random(0, numSpots));
  if (random(0, magic_chance) < 1) {
    is_magic = true;
  }
  noStroke();

}

function draw() {
  if (play == true) {
    fill(0, 12);
    stroke (255);
    rect(0, 0, width/2, height);
      j = (j % height) + bSpeed;
  }
    line(0,height/2,width/2,height/2);
    noStroke();
  for (var i=0; i < spots.length; i++) {
    if (play == true) {
      fill(255/numSpots*i,255/numSpots*i-130,255);
      if (i == chosen_spot && is_magic){
        fill(255,0,0);
      }
      spots[i].move(); // Move each object
      spots[i].display(); // Display each object
      
      // make panelB
      panelB = get(0, height/2,width/2,1);
      image(panelB, width/2, j);
      //copy(0,height/2,width/2,1, width/2,0,width/2,height);
    }
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
