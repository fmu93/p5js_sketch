class Ant {

    constructor(pos_, size_, dna_) {
        if (pos_) {
            this.pos = pos_;
        } else {
            this.pos = createVector(random(width), random(height));
        }
        this.vel = createVector();
        this.acc = createVector();

        if (size_) {
            this.size = size_;
            constrain(this.size, 0, 80);
        } else {
            this.size = random(5, 10);
        }

        if (dna_) { 
            this.dna = dna_;
        } else {
            this.dna = new DNA();
        }

        this.fitness = 0;
        this.wanderForce = this.dna.genes[0];
        this.mateForce = this.dna.genes[1];
        this.eatForce = this.dna.genes[2];
        this.escapeForce = this.dna.genes[3];
        this.sight = this.dna.genes[4];

        this.sex = floor(random(2)); // 0 male, 1 female
        this.parents = [];
        this.age = 0;
        this.maturity = random(100, 300);
        this.death = random(500, 700);
        this.color = [100 + 80 * this.sex, 40, 25, 255];
        this.babies = [];
        this.ateCount = 0;
    }

    fitness() {
        // fitness is a function of how many babies it made and how many others ate
        this.fitness = this.babies.length + this.ateCount;
    }

    show() {
        colorMode(HSL);
        noStroke();
        fill(this.color);
        rectMode(CENTER);
        if (backOn) rect(this.pos.x, this.pos.y, this.size, this.size);
        // show link to parents if young
        if (this.parents.length > 1 && this.age < this.maturity) {
            colorMode(RGB);
            stroke(255, 60);
            line(this.pos.x, this.pos.y, this.parents[0].pos.x, this.parents[0].pos.y);
            line(this.pos.x, this.pos.y, this.parents[1].pos.x, this.parents[1].pos.y);
        }
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    wander() {
        this.applyForce(p5.Vector.random2D().mult(this.wanderForce));
    }

    mature() {
        this.age += 1;
         if (this.age > this.maturity) {
            this.color[1] = 240;
           // this.color[2] = 60;
            this.color[2] = pow(map(this.age, this.maturity, this.death, 220, 30), 0.8);
           // this.color = [100 + 80 * this.sex, 50 + 100 * this.sex, 230, map(this.age, this.maturity, this.death, 255, 50)];
        }
    }

    friction() {
        this.vel.mult(0.98);
    }

    walls() {
        if (this.pos.x < width * 0.02) this.applyForce(createVector(1, 0));
        else if (this.pos.x > width * 0.98) this.applyForce(createVector(-1, 0));
        if (this.pos.y < height * 0.02) this.applyForce(createVector(0, 1));
        else if (this.pos.y > height * 0.98) this.applyForce(createVector(0, -1));
    }

    isMature() {
        return this.age > this.maturity;
    }

    isDead() {
        return this.age > this.death;
    }

    isFamily(other) {
        return this.parents.includes(other) || this.babies.includes(other);
    }
}