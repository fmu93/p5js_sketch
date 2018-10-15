class player {
  constructor() {
    this.pos = new position(this, 300, 300);
    this.img = new graphics(this, this.pos, "roshan");

    this.properties = [
      this.pos, 
      this.img
    ];

    objects.push(this);
  }
}
