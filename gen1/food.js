class Food {
    constructor(pos_) {
        if (pos_) {
            this.pos = pos_;
        } else {
            this.pos = createVector(random(width), random(height));
        }
        this.nutrition = foodLife;
    }
}