function Path(start, end) {

  // A Path is line between two points (PVector objects)
  this.start = start;
  this.end = end;
  // A path has a radius, i.e how far is it ok for the boid to wander off
  this.radius = 40*scaler;


  // Draw the path
  this.display = function() {

    strokeWeight(this.radius*2);
    stroke(0,50);
    line(this.start.x,this.start.y,this.end.x,this.end.y);

    strokeWeight(1);
    stroke(0);
    line(this.start.x,this.start.y,this.end.x,this.end.y);
  }
}
