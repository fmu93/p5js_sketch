var nodes = [];
var l0;
var theta;
var h0;
var s0;
var res = 3
var limL = 35;
var r = 200;
var mouse;
var mousePrev;
var slider1;
var slider2;
var isDraw = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  theta = PI / 4;
  l0 = width / res;
  h0 = tan(theta) * l0 / 2;
  s0 = l0 / 2 / cos(theta);

  for (var i = 0; i < width / l0 + 1; i++) {
    nodes[i] = [];
    for (var j = 0; j < height / h0 + 1; j++) {
      //nodes[i][j] = createVector(i * l0 - j % 2 * l0 / 2, j * h0);
      nodes[i][j] = [new Triangle(createVector(i * l0 - j % 2 * l0 / 2, j * h0), s0, false),
        new Triangle(createVector(i * l0 - j % 2 * l0 / 2, j * h0), s0, true)
      ];
    }
  }

  setDom();

}

function draw() {
  background(0);
  //stroke(0);
  noStroke();
  //theta = map(mouseX, 0, width, 0, PI)
  mouse = createVector(mouseX, mouseY);
  if (!mousePrev || mousePrev.dist(mouse) > 50) {
    mousePrev = mouse.copy();
  }

  for (var i = 0; i < nodes.length; i++) {
    for (var j = 0; j < nodes[0].length; j++) {
      if (isDraw && frameCount % 15 == 0) {
        nodes[i][j][0].updateShowFactor();
        nodes[i][j][1].updateShowFactor();
      }
      
      nodes[i][j][0].show();
      nodes[i][j][1].show();
    }
  }

  noFill();
  stroke(0);
  ellipse(mouseX, mouseY, slider2.value(), slider2.value())
}

class Triangle {

  constructor(pos, s, ori) {
    this.pos = pos;
    this.s = s;
    this.ori = ori;
    this.color = color(80 + random(60), 50 + random(120), 300 - random(200));
    this.showFactor = [floor(random(2)), floor(random(2)), floor(random(2)), floor(random(2))];
    this.children = [];
    if (this.s > limL) {
      this.addChildren();
    }
  }

  // first triangle
  show() {
    fill(this.color);
    noStroke();

    push();
    translate(this.pos.x, this.pos.y);
    if (this.ori) rotate(PI); // TODO control input
    beginShape();
    vertex(0, 0);
    vertex(this.s * cos(theta), -this.s * sin(theta));
    vertex(-this.s * cos(theta), -this.s * sin(theta));
    endShape(CLOSE);
    pop();

    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i] && !this.showFactor[i]) this.children[i].show();
    }
  }

  addChildren() {
    // top 
    var topPos = this.pos.copy();
    this.children.push(new Triangle(topPos, this.s / 2, this.ori));
    //left
    var leftPos = this.pos.copy().add(this.s / 2 * cos(theta), -this.s / 2 * sin(theta));
    this.children.push(new Triangle(leftPos, this.s / 2, this.ori));
    // bottom
    var bottomPos = this.pos.copy().add(0, -this.s * sin(theta));
    this.children.push(new Triangle(bottomPos, this.s / 2, !this.ori));
    // right
    var rightPos = this.pos.copy().add(-this.s / 2 * cos(theta), -this.s / 2 * sin(theta));
    this.children.push(new Triangle(rightPos, this.s / 2, this.ori));
  }

  updateShowFactor() {
    if (mouse.dist(this.pos) <= slider2.value()/2) {
      this.showFactor = [floor(random(slider1.value())), floor(random(slider1.value())), floor(random(slider1.value())), floor(random(slider1.value()))];
    }
    
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].updateShowFactor();
    }
  }
}

function setDom() {
  slider1 = createSlider(0, 10, 4);
  slider1.position(16, 20);
  slider1.style('width', '130px');

  slider2 = createSlider(20, 600, r);
  slider2.position(16, 48);
  slider2.style('width', '130px');
  
}

function mouseClicked() {
  isDraw = !isDraw;
}

function pos2boolean() {
  return round(map(mouseX, 0, width, 1, 0))
}