class Population {

    constructor(m, n) {
        this.mutationRate = m;
        this.ants = [];
        this.deadAnts = [];
        this.generations = 0;
        this.maxPop = 200;
        this.cannibalFactor = 0.5;
        this.cannibalChance = 0.1;
        this.weakTime = 0.1;
        for (var i = 0; i < n; i++) {
            this.addAnt(new Ant());
        }
    }

    run() {
        // age ant and remove if dead
        this.age();
        this.showDead();

        for (var i = 0; i < this.ants.length; i++) {
            this.ants[i].walls();
            this.ants[i].friction();
            this.interact(this.ants[i]);
            if (!this.ants[i].cannibal) this.lookForFood(this.ants[i]);
            // only wander if nothing else to do
            if (this.ants[i].acc.magSq() == 0) {
                this.ants[i].wander();
            }
            this.ants[i].update();
            this.ants[i].show();
        }

        if (this.ants.length == 0) {
            for (var i = 0; i < n; i++) {
                this.addAnt(new Ant());
            }
        }

    }

    lookForFood(thisAnt) {
        var closest = null;
        var closestDist = Infinity;

        for (var i = 0; i < food.length; i++) {
            var relPos = p5.Vector.sub(food[i], thisAnt.pos);
            var dist = relPos.mag();

            if (dist < closestDist) {
                closest = food[i];
                closestDist = dist;
            }
        }

        if (closest) {
            if (closestDist < thisAnt.size) {
                thisAnt.life += foodLife;
                food.splice(food.indexOf(closest), 1);
            } else if (closestDist < thisAnt.eatSight) {
                thisAnt.seekFood(closest);
            }
        }
    }

    interact(thisAnt) {
        var closestAnt = null;
        var closestDist = Infinity;

        for (var j = 0; j < this.ants.length; j++) {
            var otherAnt = this.ants[j];
            if (thisAnt == otherAnt) continue;

            var relPos = p5.Vector.sub(otherAnt.pos, thisAnt.pos);
            var dist = relPos.mag();
            if (dist - otherAnt.size < closestDist && this.interest(thisAnt, otherAnt)) {
                closestAnt = otherAnt;
                closestDist = dist;
            }
        }

        if (closestAnt) {
            // they touch
            if (closestDist < thisAnt.size + closestAnt.size) {
                // mate if different sex and mature
                if (this.canMate(thisAnt, closestAnt)) {
                    var newAnt = this.mate(thisAnt, closestAnt);
                    if (newAnt) this.addAnt(newAnt);

                    // eat if one is mature but not the other and same sex and not family
                } else if (this.canKill(thisAnt, closestAnt)) {
                    this.kill(thisAnt, closestAnt);
                } else {
                    thisAnt.avoid(closestAnt.pos); // maintain distance
                }

                // this ant can see
            } else if (closestDist < thisAnt.mateSight && this.canMate(thisAnt, closestAnt)) {
                thisAnt.seekSex(closestAnt.pos);
            } else if (closestAnt.cannibal && closestDist < thisAnt.escapeSight && this.canKill(closestAnt, thisAnt)) {
                thisAnt.avoid(closestAnt.pos);
            } else if (thisAnt.cannibal && closestDist < thisAnt.eatSight && this.canKill(thisAnt, closestAnt)) {
                thisAnt.seekFood(closestAnt.pos);
            }
        }
    }

    cannibal(thisAnt) {
        return this.ants.indexOf(thisAnt) > this.maxPop * 0.8;
    }

    canMate(thisAnt, otherAnt) {
        return thisAnt.sex + otherAnt.sex == 1 &&
            this.ants.length < this.maxPop &&
            !this.isFamily(thisAnt, otherAnt) &&
            thisAnt.isMature() &&
            otherAnt.isMature() &&
            !thisAnt.cannibal &&
            !otherAnt.cannibal;
    }

    canKill(thisAnt, otherAnt) {
        var cond = thisAnt.cannibal && (
            //!thisAnt.isMature() &&
            //!otherAnt.isMature() &&
            (this.sameSex(thisAnt, otherAnt) &&
                !this.isFamily(thisAnt, otherAnt)) ||
            otherAnt.cannibal);
        return cond;
    }

    sameSex(thisAnt, otherAnt) {
        return (thisAnt.sex + otherAnt.sex) % 2 == 0;
    }

    isFamily(thisAnt, otherAnt) {
        return thisAnt.parents.includes(otherAnt) ||
            otherAnt.parents.includes(thisAnt) ||
            thisAnt.babies.includes(otherAnt) ||
            otherAnt.babies.includes(thisAnt);
    }

    interest(thisAnt, otherAnt) {
        return (this.canMate(thisAnt, otherAnt) || this.canKill(thisAnt, otherAnt) || this.canKill(otherAnt, thisAnt));
    }

    kill(eater, eated) {
        eated.kill();
    }

    mate(thisAnt, otherAnt) {
        // check that their partner is not family
        if (!this.isFamily(thisAnt, otherAnt)) {

            var babyDNA = thisAnt.lifeCrossover(otherAnt);
            if (random() < this.mutationRate) {
                babyDNA.mutate();
            }

            var babyAnt = new Ant(thisAnt.pos.copy(), babyDNA);
            // same color than parent of same sex
            if (babyAnt.sex == thisAnt.sex) {
                babyAnt.color = thisAnt.color;
            } else {
                babyAnt.color = otherAnt.color;
            }
            if (this.cannibalism() && random() < this.cannibalChance) {
                babyAnt.cannibal = true;
            }
            // give some time between births
            this.weaken(thisAnt);
            this.weaken(otherAnt);

            // keep track of family tree
            babyAnt.parents.push(thisAnt, otherAnt);
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

    weaken(thisAnt) {
        thisAnt.maturity = thisAnt.age + thisAnt.life * this.weakTime;
    }

    addAnt(newAnt) {
        if (this.ants.length < this.maxPop) {
            this.ants.push(newAnt);
        }
    }

    age() {
        for (var i = this.ants.length - 1; i >= 0; i--) {
            this.ants[i].mature(); // add age and return true if dead
            if (this.ants[i].isDead()) {
                addFood(this.ants[i].pos);
                this.deadAnts.push(this.ants[i]);
                this.ants.splice(i, 1);
            }
        }
    }

    cannibalism() {
        return this.ants.length > this.maxPop * this.cannibalFactor;
    }

    showDead() {
        if (this.deadAnts.length > 50) this.deadAnts.splice(0, 1);

        strokeWeight(1);
        for (var i = 0; i < this.deadAnts.length; i++) {
            if (this.deadAnts[i].killed) {
                fill(0, 100, map(i, 0, this.deadAnts.length, 0, 35));
                noStroke();
            } else {
                noFill();
                stroke(0, 0, map(i, 0, this.deadAnts.length, 0, 120), 35);
            }
            //fill(150, 150, 100);
            rect(this.deadAnts[i].pos.x, this.deadAnts[i].pos.y, this.deadAnts[i].size, this.deadAnts[i].size);
        }
    }

}