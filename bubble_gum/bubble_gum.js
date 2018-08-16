
// module aliases
var Engine = Matter.Engine,
// Render = Matter.Render, // don't need it
World = Matter.World,
Bodies = Matter.Bodies;

// create an engine			
var engine;
var world;

var n = 120; 
var bubbles = [];
var forceCoeff = 0.000002
var back = 0;

var blendModes = ['BLEND', 'DARKEST', 'LIGHTEST', 'DIFFERENCE', 'MULTIPLY', 'EXCLUSION', 'SCREEN', 'REPLACE', 'OVERLAY', 'HARD_LIGHT', 'SOFT_LIGHT', 'DODGE', 'BURN', 'ADD', 'NORMAL'];
var b = 0;

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
	// blendMode(NORMAL);
	background(back);

	// draw circles
	for (var i=0; i < bubbles.length; i++) {
		var bubble = bubbles[i];
		var from = Matter.Vector.create(mouseX, mouseY);
		var force = Matter.Vector.create(-(bubble.body.position.x - mouseX)*forceCoeff, -(bubble.body.position.y - mouseY)*forceCoeff);
		Matter.Vector.mult(force, bubble.body.mass);
		Matter.Body.applyForce(bubble.body, from, force);
		bubble.show();
	}
  
}

function mousePressed() {
	forceCoeff *= -1;
	console.log(b);
	b = (b+1)/blendModes.lenght;
}

function mouseDragged() {
	// var bubble = new Bubble(mouseX, mouseY);
 //  	bubbles.push(bubble);
}
