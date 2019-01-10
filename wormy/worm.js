class Worm {
    constructor(pos_) {
        this.head = new Segment(pos_);
        this.count = 5;
        this.segments = [];

        var next = this.head.getEnd();
        for (var i = 0; i < this.count; i++) {
            var newSeg = new Segment(next);
            this.segments.push(newSeg);
            next = newSeg.getEnd();
        }
    }

    update(pos_) {
        this.head.update(pos_);

        var next = this.head.getEnd();
        for (var i = 0; i < this.count; i++) {
            this.segments[i].update(next);
            next = this.segments[i].getEnd();
        }

    }

    show() {
        stroke(100);
        strokeWeight(2);
        ellipse(this.head.x, this.head.y, 20, 20);

        for (var i = 0; i < this.count; i++) {
            this.segments[i].show();
        }
    }
}