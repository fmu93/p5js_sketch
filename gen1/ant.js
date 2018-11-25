function Ant(pos_, size_) {

    if (pos_) {
        this.pos = pos_;
    } else {
        this.pos = createVector(random(width), random(height));
    }
    this.vel = createVector();
    this.acc = createVector();

    if (size_) {
        this.size = size_;
    } else {
        this.size = random(5, 10);
    }
    this.sex = floor(random(2)); // 0 male, 1 female
    this.parents = []; 
    this.age = 0;
    this.maturity = random(100, 300);
    this.death = random(500, 700);
    this.color = [150, 100*this.sex, 30];

    this.show = function() {
        fill(this.color);
        rect(this.pos.x, this.pos.y, this.size, this.size);
    }

    this.update = function() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.wander = function() {
        this.applyForce(p5.Vector.random2D().mult(0.2));
    }

    this.mate = function(male, female) {
        if (!(this.parents.includes(male) || this.parents.includes(female)) && this.age > this.maturity) {
            this.parents.push(male);
            this.parents.push(female);
            var babyAnt = new Ant(male.pos.copy(), (male.size + female.size)*0.6);
            babyAnt.color = [180, 100*this.sex, 30];
            return babyAnt;
        }
    }

    this.mature = function() {
        this.age += 1;
        if (this.age > this.death) {
            return true
        }
        else if (this.age > this.maturity) {
            this.color = [150*this.sex, 100, 200];
        }
        return false
    }

    this.friction = function() {
        this.vel.mult(0.98);
    }

    this.walls = function() {
        if (this.pos.x < width*0.02) this.applyForce(createVector(1, 0));
        else if (this.pos.x > width*0.98) this.applyForce(createVector(-1, 0));
        if (this.pos.y < height*0.02) this.applyForce(createVector(0, 1));
        else if (this.pos.y > height*0.98) this.applyForce(createVector(0, -1));
    }
}