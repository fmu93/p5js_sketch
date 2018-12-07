class Population {

    constructor(m, n) {
        this.mutationRate = m;
        this.ants = [];
        this.deadAnts = [];
        this.generations = 0;
        this.maxPop = 500;
        for (var i = 0; i < n; i++) {
            this.addAnt();
        }
    }

    run() {
        // age ant and remove if dead
        this.age();
        this.showDead();

        for (var i = 0; i < this.ants.length; i++) {
            var thisAnt = this.ants[i];
            // check each other ant and react
            for (var j = i; j < this.ants.length; j++) {
                var otherAnt = this.ants[j];

                var relPos = p5.Vector.sub(otherAnt.pos, thisAnt.pos);
                var dist = relPos.mag();

                // they touch
                if (dist < thisAnt.size + otherAnt.size) {
                    // mate if different sex and mature
                    if (this.canMate(thisAnt, otherAnt)) {
                        var newAnt = this.mate(thisAnt, otherAnt);
                        if (newAnt) this.ants.push(newAnt);

                    // eat if one is mature but not the other and same sex and not family
                    } else if (this.canEat(thisAnt, otherAnt)) {
                           this.eat(thisAnt, otherAnt);
                    }

                // this ant can see
                } else if (dist < thisAnt.sight) {
                    if (this.canMate(thisAnt, otherAnt)) {
                        thisAnt.seek(otherAnt.pos);
                    } else if (this.canEat(thisAnt, otherAnt)) {
                        thisAnt.avoid(otherAnt.pos); 
                    }
                }
            }

            this.ants[i].wander();
            this.ants[i].walls();
            this.ants[i].update();
            this.ants[i].friction();
            this.ants[i].show();
        }
    }

    canMate(thisAnt, otherAnt) {
        return thisAnt.sex + otherAnt.sex == 1 &&
        this.ants.length < this.maxPop &&
        !this.isFamily(thisAnt, otherAnt) &&
        thisAnt.isMature() &&
        otherAnt.isMature();
    }

    canEat(thisAnt, otherAnt) {
        return thisAnt.isMature() &&
                !otherAnt.isMature() && 
                (thisAnt.sex + otherAnt.sex) % 2 == 0 &&
                !this.isFamily(thisAnt, otherAnt);
    }

    isFamily(thisAnt, otherAnt) {
        return thisAnt.parents.includes(otherAnt) || thisAnt.babies.includes(otherAnt) || thisAnt.parents.includes(otherAnt.parents);
    }

    eat(eater, eated) {
        // eater takes age of eated and slows down
        eater.life += eated.age;
        eater.wanderForce *= 0.9;
        // eated gets life and size
        eater.size = eated.size*0.5;
        eated.killed = true;
    }

    mate(thisAnt, otherAnt) {
        // check that their partner is not family
        if (!this.isFamily(thisAnt, otherAnt)) {

            var babyDNA = thisAnt.dna.crossover(otherAnt.dna);
            if (random() < this.mutationRate) {
                babyDNA.mutate();
            }

            var babyAnt = new Ant(thisAnt.pos.copy(), (thisAnt.size + otherAnt.size) * 0.6, babyDNA);
            // give some time between births
            thisAnt.maturity = thisAnt.age + thisAnt.life*0.1;
            otherAnt.maturity = otherAnt.age + otherAnt.life*0.1;

            // keep track of family tree
            babyAnt.parents.push(thisAnt);
            babyAnt.parents.push(otherAnt);
            thisAnt.babies.push(babyAnt);
            otherAnt.babies.push(babyAnt);
            return babyAnt;
        }
    }

    fitness() {
        for (var i = 0; i < this.ants.length; i++) {
            this.ants[i].fitness();
        }
    }

    addAnt(pos, size, dna) {
        this.ants.push(new Ant(pos, size, dna));
    }

    age() {
        for (var i = this.ants.length - 1; i >= 0; i--) {
            this.ants[i].mature(); // add age and return true if dead
            if (this.ants[i].isDead() || this.ants[i].killed) {
                this.deadAnts.push(this.ants[i]);
                this.ants.splice(i, 1);
            }
        }
    }

    showDead() {
        while (this.deadAnts.length > 100) {
            this.deadAnts.splice(1, 1);
        }
        colorMode(HSL);
        for (var i = 0; i < this.deadAnts.length; i++) {
            if (this.deadAnts[i].killed) {
                fill(0, 100, map(i, 0, this.deadAnts.length, 0, 35));
                noStroke();
            } else {
                noFill();
                stroke(map(i, 0, this.deadAnts.length, 0, 120));
            }
            //fill(150, 150, 100);
            rect(this.deadAnts[i].pos.x, this.deadAnts[i].pos.y, 10, 10);
        }
    }

}