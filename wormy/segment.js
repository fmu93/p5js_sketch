class Segment {
    constructor(pos_) {
        this.start = pos_;
        this.len = 60;
        this.end = this.start.copy();
        this.end.add(this.len, 0);
    }

    update(start_){
        var seg0 = p5.Vector.sub(this.end, this.start);
        var seg1 = p5.Vector.sub(this.end, start_);
        var angle = atan2(seg1.y - seg0.y, seg1.x - seg0.x);
        //var angle = p5.Vector.angleBetween(seg0, seg1);

        seg0.rotate(angle);
        var diff = p5.Vector.sub(seg1, seg0);
        this.end.add(diff);
        
        this.start = start_.copy();
    }

    getEnd() {
        return this.end;
    }

    show() {
        line(this.start.x, this.start.y, this.end.x, this.end.y);
        ellipse(this.start.x, this.start.y, 5, 5);
    }


}