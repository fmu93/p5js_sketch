function FlowField() {
  this.field = [];
  this.resolution = 50*scaler;
  this.cols = width/this.resolution + 1;
  this.rows = height/this.resolution + 1;;
  this.toff = 0;
  this.deltaTime = 0.002;
  this.deltaOff = 0.2;

  this.init = function() {
    var xoff = 0;
    var xoffB = 5;
    for (var i = 0; i < this.cols; i++) {
    	this.field[i] = []
      var yoff = 0;
      var yoffB = 5;
      for (var j = 0; j < this.rows; j++) {
        var theta = map(noise(xoff, yoff, this.toff), 0, 1, 0, TWO_PI);
        var mag = map(noise(xoffB, yoffB, this.toff), 0, 1, 0.05, 0.4);
        
        var v = p5.Vector.fromAngle(theta);
        v.setMag(mag);
        this.field[i][j] = v;
        
        yoff += this.deltaOff;
        yoffB += this.deltaOff/5;
      }
      xoff += this.deltaOff;
      xoffB += this.deltaOff/5;
    }
  }

  this.timeStep = function() {
    this.toff += this.deltaTime;
    this.init();
  }

   this.lookup = function(lookup) {
    var column = int(constrain(lookup.x/this.resolution, 0, this.cols-1));
    var row = int(constrain(lookup.y/this.resolution, 0, this.rows-1));
    return this.field[column][row];
  }

  this.display = function() {
    stroke(200);
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        push();
        strokeWeight(this.field[i][j].mag());
        translate(this.resolution*i, this.resolution*j);
        rotate(this.field[i][j].heading());
        ellipse(0, 0, 4, 4);
        line(0, 0, 30, 0);
        pop();
      }
    }
  }

}