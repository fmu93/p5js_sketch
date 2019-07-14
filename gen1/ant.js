class Ant {

    constructor(pos_, dna_) {
        if (pos_) {
            this.pos = pos_;
        } else {
            this.pos = createVector(random(width), random(height));
        }
        this.vel = p5.Vector.random2D();
        this.acc = createVector();

        if (dna_) {
            this.dna = dna_;
        } else {
            this.dna = new DNA();
        }

        this.fitness = 0;
        this.wanderForce = this.dna.genes[0];
        this.mateSight = this.dna.genes[1];
        this.eatSight = this.dna.genes[2];
        this.escapeSight = this.dna.genes[3];

        this.maxeatspeed = this.dna.genes[4];
        this.maxeatforce = this.dna.genes[5];
        this.maxmatespeed = this.dna.genes[6];
        this.maxmateforce = this.dna.genes[7];
        this.maxavoidspeed = this.dna.genes[8];
        this.maxavoidforce = this.dna.genes[9];
        this.edges = floor(this.dna.genes[10]);
        this.size = this.dna.genes[11];
        this.sex = floor(this.dna.genes[12]) % 2;
        this.maturity0 = this.dna.genes[13];
        this.life0 = this.dna.genes[14];
        this.hue = this.dna.genes[15] % 360;

        this.parents = [];
        this.age = 0;
        this.maturity = this.maturity0;
        this.life = this.life0;

        this.color = [this.hue, 100, 60];
        this.colorChild = [this.hue, 75, 40];

        this.babies = [];
        this.ateCount = 0;
        this.killed = false;
        this.cannibal = false;

        this.futurePos = this.pos.copy();
        this.futurePosFactor = 25;
    }

    fitness() {
        // fitness is a function of how many babies it made and how many others ate
        this.fitness = this.babies.length + this.ateCount;
    }

    kill() {
        this.killed = true;
    }

    makeShape() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        beginShape();
        for (var i = 0; i < this.edges; i++) {
            var x = cos(i * TWO_PI / this.edges) * this.size;
            var y = sin(i * TWO_PI / this.edges) * this.size;
            vertex(x, y);
        }

        endShape(CLOSE);
        if (!this.isDead()) {
            stroke(this.color);
            strokeWeight(2);
            line(0, 0, this.size, 0);
        }
        pop();
    }

    show() {
        if (isCircles) {
            noFill();
            strokeWeight(2);
            if (isFade) {
                stroke(foodColorA);
            } else {
                stroke(foodColor);
            }
            ellipse(this.futurePos.x, this.futurePos.y, this.eatSight * 2, this.eatSight * 2);
            if (isFade) {
                stroke(mateColorA);
            } else {
                stroke(mateColor);
            }
            ellipse(this.futurePos.x, this.futurePos.y, this.mateSight * 2, this.mateSight * 2);
        }

        if (backOn) {
            if (this.cannibal) {
                strokeWeight(4);
                stroke('hsla(0, 80%, 50%, 0.8)')
            } else {
                noStroke();
            }
            if (this.isMature()) {
                fill(this.color);
            } else {
                fill(this.colorChild);
            }
            rectMode(CENTER);
            this.makeShape();

            fill(0);
            noStroke();
            if (this.sex) {
                text('-', this.pos.x, this.pos.y);
            } else {
                text('+', this.pos.x, this.pos.y);
            }
        }
        // show link to parents if young
        if (this.parents.length > 1) {
            strokeWeight(2);
            if (isFade || !backOn) {
                stroke(mateColorA);
            } else {
                stroke(mateColor);
            }
            if (!this.parents[0].isDead()) line(this.pos.x, this.pos.y, this.parents[0].pos.x, this.parents[0].pos.y);
            if (!this.parents[1].isDead()) line(this.pos.x, this.pos.y, this.parents[1].pos.x, this.parents[1].pos.y);
        }

    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

        this.futurePos = this.vel.copy();
        this.futurePos.mult(this.futurePosFactor);
        this.futurePos.add(this.pos);

        this.color[0] = (this.color[0] + 0.2) % 360;
        this.colorChild[0] = (this.colorChild[0] + 0.2) % 360;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    seekFood(target) {
        var desired = p5.Vector.sub(target, this.pos); // A vector pointing from the position to the target

        // If the magnitude of desired equals 0, skip out of here
        // (We could optimize this to check if x and y are 0 to avoid mag() square root
        if (desired.mag() == 0) return;

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxeatspeed);
        // Steering = Desired minus Velocity
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxeatforce); // Limit to maximum steering force

        this.applyForce(steer);
    }

    seekSex(target) {
        var desired = p5.Vector.sub(target, this.pos); // A vector pointing from the position to the target

        // If the magnitude of desired equals 0, skip out of here
        // (We could optimize this to check if x and y are 0 to avoid mag() square root
        if (desired.mag() == 0) return;

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxmatespeed);
        // Steering = Desired minus Velocity
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxmateforce); // Limit to maximum steering force

        this.applyForce(steer);
    }

    avoid(target) {
        var desired = p5.Vector.sub(this.pos, target);
        if (desired.mag() == 0) return;

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxavoidspeed);
        // Steering = Desired minus Velocity
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxavoidforce); // Limit to maximum steering force

        this.applyForce(steer);
    }

    wander() {
        this.vel.setMag(this.wanderForce);
    }

    mature() {
        this.age += 1;
        if (this.life * 0.7 < this.age) {
            this.color[2] = map(this.age, this.life * 0.7, this.life, 60, 20);
        }
    }

    friction() {
        this.vel.mult(0.98);
    }

    walls() {
        if (this.pos.x < 0) this.applyForce(createVector(0.5, 0));
        else if (this.pos.x > width) this.applyForce(createVector(-0.5, 0));
        if (this.pos.y < 0) this.applyForce(createVector(0, 0.5));
        else if (this.pos.y > height) this.applyForce(createVector(0, -0.5));
    }

    isMature() {
        return this.age > this.maturity;
    }

    isDead() {
        return (this.age > this.life) || this.killed;
    }

    updateDna() {
        // [wander force, mate sight, eat sight, escape sight, maxspeed, maxforce, edges, size]
        this.dna.updateGenes([this.wanderForce, this.mateSight, this.eatSight, this.escapeSight,
            this.maxeatspeed, this.maxeatforce, this.maxmatespeed, this.maxmateforce, this.maxavoidspeed, this.maxavoidforce,
            this.edges, this.size, this.sex, this.maturity0, this.life0, this.hue
        ]);
    }

    lifeCrossover(otherAnt) {
        this.updateDna;
        otherAnt.updateDna;
        return this.dna.crossover(otherAnt.dna)
    }
}