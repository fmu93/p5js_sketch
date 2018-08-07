// vintage lines

// param
var NUM_LINES = 18;
var TRACE = 200;
var LINE_DIST = 0.3;
var numCases = 4;
var backgroundOn = true;
var t = 1;
var k = 0;
var inc = 0.05;
var Z; // zoom factor
var case1 = 0;
var case2 = 0;
var subX = 0;
var subY = 0;
var myalpha = 255;
var backFade = 8;
var lineStroke = 120;

function setup() {
  background(20);
  createCanvas(windowWidth-8, windowHeight-8);
  Z = height/3;
}

function draw() {
  // fading background
  fill(0, myalpha);
  rect(0,0,width,height);
  
  strokeWeight(3);
  translate(width/2, height/2);
  
  // points
  //point(x1(t), y1(t));
  //point(x2(t), y2(t));
  
  // case and subCase (within cuadrant)
  case1 = int(float(mouseX)/width * numCases);
  case2 = int(float(mouseY)/height * numCases);
  subX = (mouseX - (width/numCases)*case1) / float(width/numCases) * (1-2*(case1%2));
  subY = (mouseY - (height/numCases)*case2) / float(height/numCases) * (1-2*(case2%2)); 
  
  // lines
  for (var i = 0; i < NUM_LINES*LINE_DIST; i += LINE_DIST) {  
    stroke(255, 255 - pow(i,2)*20);
    line(x1(t-i, case1), y1(t-i, case1), x2(t-i, case2), y2(t-i, case2));
  }
  
  // trace
  strokeWeight(1);
  for (var i = 0; i < TRACE; i++) {
    //stroke(200, 200, 100); // Yellow for curve 1
    stroke(255, lineStroke);
    point(x1(t-i, case1), y1(t-i, case1));
    //stroke(100, 220, 100); // green for curve 2
    point(x2(t-i, case2), y2(t-i, case2));
  }
  
  inc = abs(0.015*(1+pow(1.5*sin(k/2), 4))); // dynamic speed change
  k += 0.02;
  t += inc;
}

// curve switch

// click events

function mouseClicked() {
  background(0);
  if (myalpha > backFade) {
    myalpha = backFade;
    lineStroke = 20;
  } else { 
    myalpha = 255;
    lineStroke = 120;
  }
}

// coordinates

function x1(t,caseNow) {
  var v = 0;
  switch(caseNow) {
    case 0:
      v = (0.5-subX)*Z*sin(-t/4)+Z/2*cos(t/4);
      break;
    case 1: 
      v = Z/2*cos(-t/2)+(0.5-subX)*Z*sin(t);
      break;
    case 2:
      v = (0.5-subX)*Z/2*cos(-t/4) + Z*sin(t);
      break;
    case 3: 
      v = (0.5-subX)*Z*cos(+t/4) - Z/4*sin(-t/2);
      break;
  }
  return v;
}

function y1(t, caseNow) {
  var v = 0;
  switch(caseNow) {
    case 0:
      v = -Z*cos(-t/2)+(0.5-subY)*Z/4*cos(t/2);
      break;
    case 1: 
      v = -Z/2*sin(-t)-(0.5-subY)*Z*cos(t/2);
      break;
    case 2:
      v = -(0.5-subY)*Z/2*cos(-t/2)-Z/2*sin(-t);
      break;
    case 3: 
      v = (0.5-subY)*Z/2*cos(-t/2)-(0.5-subY)*Z*cos(t/2) + Z*sin(t/2);
      break;
  }
  return v;
}

function x2(t, caseNow) {
  var v = 0;
  switch(caseNow) {
    case 0:
      v = Z*cos(t/4 - PI/2);
      break;
    case 1:
      v = -Z/2*sin(t/8);
      break;
    case 2:
      v = Z/8*cos(t/8) + Z/4*cos(-t/6) - Z/5*sin(t/4);
      break;
    case 4:
      v = 0;
      break;
  }
  return v;
}

function y2(t, caseNow) {
  var v = 0;
  switch(caseNow) {
   case 0:
     v = Z/50*sin(t*2);
     break;
   case 1: 
      v = Z/1.5*sin(t/8) + Z/2*cos(-t/2);
      break;
    case 2:
      v = Z/2*sin(t/8) + Z/2*cos(-t/2);
      break;
    case 3:
      v = 0;
      break;
  }
 return  v;
}
