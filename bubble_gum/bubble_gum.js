
// module aliases
var Engine = Matter.Engine,
// Render = Matter.Render, // don't need it
World = Matter.World,
Bodies = Matter.Bodies;

// create an engine			
var engine;
var world;

var n = 150; 
var bubbles = [];
var forceCoeff = 2
var back = 0;


function setup() {

	engine = Engine.create();
	world = engine.world;
	world.gravity.y = 0;
	particles = [];

  createCanvas(windowWidth, windowHeight);           // set size to that of the image
  colorMode(HSB, 255);               // allows us to access the brightness of a color
  background(back);

  // Start particles
  for (var i = 0; i < n; i++) {
  	var bubble = new Bubble(random(width), random(height));
  	bubbles.push(bubble);
  }

  // add all of the bodies to the world
  World.add(world, bubbles);
  Engine.run(engine);
}

function draw() {
	// blendMode(ADD);
	background(back);

	var from = Matter.Vector.create(mouseX, mouseY);		
	// draw circles
	for (var i=0; i < bubbles.length; i++) {
		var bubble = bubbles[i];
		var force = Matter.Vector.sub(bubble.body.position, from);
		if (Matter.Vector.magnitude(force) > bubble.r) {
			var forceMag = 1/Matter.Vector.magnitudeSquared(force);
			force = Matter.Vector.normalise(force);
			force = Matter.Vector.mult(force, -forceCoeff*forceMag*bubble.body.mass);
			Matter.Body.applyForce(bubble.body, from, force);
		}
		bubble.show();	
	}
  
}

function mousePressed() {
	forceCoeff *= -1;
}

function mouseDragged() {
	// var bubble = new Bubble(mouseX, mouseY);
 //  	bubbles.push(bubble);
}
