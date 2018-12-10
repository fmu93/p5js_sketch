class Ant {

    constructor(pos_, dna_) {
        if (pos_) {
            this.pos = pos_;
        } else {
            this.pos = createVector(random(width), random(height));
        }
        this.vel = createVector();
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

        this.edges = this.dna.genes[10];
        this.size = this.dna.genes[11];
        constrain(this.size, 4, 200);

        this.sex = floor(random(2)); // 0 male, 1 female
        this.parents = [];
        this.age = 0;
        this.maturity = random(100, 300);
        this.life = random(500, 700);
        this.color = [100 + 80 * this.sex, 80, 50, 255];
        this.colorChild = [100 + 80 * this.sex, 80, 15, 255];
        this.babies = [];
        this.ateCount = 0;
        this.killed = false;
        this.cannibal = false;
    }

    fitness() {
        // fitness is a function of how many babies it made and how many others ate
        this.fitness = this.babies.length + this.ateCount;
    }

    show() {
        if (backOn) {
            if (this.cannibal) {
                stroke('hsla(0, 80%, 50%, 0.5)')
            } else {
                noStroke();
            }
            if (this.isMature()) {
                fill(this.color);
            } else {
                fill(this.colorChild);
            }
            rectMode(CENTER);
            strokeWeight(3);

            //rect(this.pos.x, this.pos.y, this.size, this.size);
            push();
            translate(this.pos.x, this.pos.y);
            beginShape();
            for (var i = 0; i < this.edges; i++) {
                var x = cos(i * TWO_PI / this.edges) * this.size;
                var y = sin(i * TWO_PI / this.edges) * this.size;
                vertex(x, y);
            }
            endShape(CLOSE);
            pop();
        }

        noFill();
        stroke(foodColorA);
        ellipse(this.pos.x, this.pos.y, this.eatSight*2, this.eatSight*2);
        stroke(mateColorA);
        ellipse(this.pos.x, this.pos.y, this.mateSight*2, this.mateSight*2);

        // show link to parents if young
        if (this.parents.length > 1) {
            if (!this.parents[0].isDead()) line(this.pos.x, this.pos.y, this.parents[0].pos.x, this.parents[0].pos.y);
            if (!this.parents[1].isDead()) line(this.pos.x, this.pos.y, this.parents[1].pos.x, this.parents[1].pos.y);
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
        this.applyForce(p5.Vector.random2D().mult(this.wanderForce));
    }

    mature() {
        this.age += 1;
        if (this.isMature()) {
            this.color[2] = pow(map(this.age, 0, this.life, 300, 30), 0.75);
        }
    }

    friction() {
        this.vel.mult(0.98);
    }

    walls() {
        if (this.pos.x < width * wallRepelSize) this.applyForce(createVector(1, 0));
        else if (this.pos.x > width * (1 - wallRepelSize)) this.applyForce(createVector(-1, 0));
        if (this.pos.y < height * wallRepelSize) this.applyForce(createVector(0, 1));
        else if (this.pos.y > height * (1 - wallRepelSize)) this.applyForce(createVector(0, -1));
    }

    isMature() {
        return this.age > this.maturity;
    }

    isDead() {
        return this.age > this.life;
    }

    updateDna() {
        // [wander force, mate sight, eat sight, escape sight, maxspeed, maxforce, edges, size]
        this.dna.updateGenes([this.wanderForce, this.mateSight, this.eatSight, this.escapeSight,
            this.maxeatspeed,this.maxeatforce, this.maxmatespeed,this.maxmateforce, this.maxavoidspeed,this.maxavoidforce, 
            this.edges, this.size]);
    }

    lifeCrossover(otherAnt) {
        this.updateDna;
        otherAnt.updateDna;
        return this.dna.crossover(otherAnt.dna)
    }
}