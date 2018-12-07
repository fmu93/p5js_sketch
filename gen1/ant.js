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
        this.mateForce = this.dna.genes[1]; // remove
        this.eatForce = this.dna.genes[2]; // remove
        this.escapeForce = this.dna.genes[3]; // remove
        this.sight = this.dna.genes[4];
        this.maxspeed = this.dna.genes[5];
        this.maxforce = this.dna.genes[6];

        this.sex = floor(random(2)); // 0 male, 1 female
        this.parents = [];
        this.age = 0;
        this.maturity = random(100, 300);
        this.life = random(500, 700);
        this.color = [100 + 80 * this.sex, 40, 25, 255];
        this.babies = [];
        this.ateCount = 0;
        this.killed = false;
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
        
        colorMode(RGB);
        stroke(240, 40);
        noFill();
        //ellipse(this.pos.x, this.pos.y, this.sight, this.sight)
        // show link to parents if young
        if (this.parents.length > 1 && this.age < this.maturity) {
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

    seek(target) {
        var desired = p5.Vector.sub(target, this.pos);  // A vector pointing from the position to the target

        // If the magnitude of desired equals 0, skip out of here
        // (We could optimize this to check if x and y are 0 to avoid mag() square root
        if (desired.mag() == 0) return;

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus Velocity
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);  // Limit to maximum steering force

        this.applyForce(steer);
    }

    avoid(target) {
        var desired = p5.Vector.sub(this.pos, target);  // A vector pointing from the position to the target
        if (desired.mag() == 0) return;

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus Velocity
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);  // Limit to maximum steering force

        this.applyForce(steer);
    }

    wander() {
        this.applyForce(p5.Vector.random2D().mult(this.wanderForce));
    }

    mature() {
        this.age += 1;
         if (this.age > this.maturity) {
            this.color[1] = 240;
           // this.color[2] = 60;
            this.color[2] = pow(map(this.age, this.maturity, this.life, 220, 30), 0.8);
           // this.color = [100 + 80 * this.sex, 50 + 100 * this.sex, 230, map(this.age, this.maturity, this.life, 255, 50)];
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
        return this.age > this.life;
    }
}