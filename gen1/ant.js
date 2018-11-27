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
    this.color = [100 + 80*this.sex, 100 - 50*this.sex, 30, 255];
    this.babies = [];

    this.show = function() {
        stroke(0);
        fill(this.color);
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y, this.size, this.size);
        // show link to parents if young
        if (this.parents.length > 1) { //&& this.age < this.maturity) {
            stroke(150);
            line(this.pos.x, this.pos.y, this.parents[0].pos.x, this.parents[0].pos.y);
            line(this.pos.x, this.pos.y, this.parents[1].pos.x, this.parents[1].pos.y);
        }
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
        if (this.babies.length == 0
            && (this.parents.length == 0 || !this.parents.includes(male) || !this.parents.includes(female))
            && this.age > this.maturity) {

            this.parents.push(male);
            this.parents.push(female);
            var babyAnt = new Ant(male.pos.copy(), (male.size + female.size)*0.6);
            this.babies.push(babyAnt);
            return babyAnt;
        }
    }

    this.mature = function() {
        this.age += 1;
        if (this.age > this.death) {
            return true
        }
        else if (this.age > this.maturity) {
            this.color = [100 + 80*this.sex, 50 + 100*this.sex, 230, map(this.age, this.maturity, this.death, 255, 50)];
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