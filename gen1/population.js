class Population {

    constructor(m, n) {
        this.mutationRate = m;
        this.ants = [];
        this.deadAnts = [];
        this.generations = 0;
        this.maxPop = 200;
        this.cannibalFactor = 0.7;
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
            var thisAnt = this.ants[i];

            // decide what to seek (food or mate)
            var [closest, closestDist] = this.findClosest(thisAnt);
            if (closest instanceof Ant) {
                this.interactFar(thisAnt, closest, closestDist);
            } else if (closest instanceof Food && !thisAnt.cannibal) {
                this.seekFood(thisAnt, closest, closestDist);
            }
            // eat if food very close
            if (!thisAnt.cannibal) {
                this.eatFood(thisAnt);
            }
            // 
            this.interactNear(thisAnt)

            // only wander if nothing else to do
            if (thisAnt.acc.magSq() == 0) {
                thisAnt.wander();
            }
            thisAnt.walls();
            thisAnt.friction();
            thisAnt.update();
            thisAnt.show();
        }

        if (this.ants.length == 1) {
            for (var i = 0; i < n; i++) {
                this.addAnt(new Ant());
            }
        }

    }

    findClosest(thisAnt) {
        var closest = null;
        var closestDist = Infinity;

        // iterate thru food
        for (var i = 0; i < foodArray.length; i++) {
            var relPos = p5.Vector.sub(foodArray[i].pos, thisAnt.futurePos);
            var dist = relPos.mag();

            if (dist - thisAnt.size < closestDist && dist < thisAnt.eatSight) {
                closest = foodArray[i];
                closestDist = dist;
            }
        }

        // iterate thru others
        for (var j = 0; j < this.ants.length; j++) {
            var otherAnt = this.ants[j];
            if (thisAnt == otherAnt) continue;

            var relPos = p5.Vector.sub(otherAnt.pos, thisAnt.futurePos);
            var dist = relPos.mag();
            if (dist - otherAnt.size - thisAnt.size < closestDist && this.interest(thisAnt, otherAnt)) {
                closest = otherAnt;
                closestDist = dist;
            }
        }

        return [closest, closestDist];
    }

    eatFood(thisAnt) {
        for (var i = 0; i < foodArray.length; i++) {
            var relPos = p5.Vector.sub(foodArray[i].pos, thisAnt.pos);
            var dist = relPos.mag();

            if (dist < thisAnt.size) {
                thisAnt.life += foodArray[i].nutrition;
                foodArray.splice(i, 1);
            }
        }
    }

    seekFood(thisAnt, food, closestDist) {
        if (closestDist < thisAnt.eatSight) {
            thisAnt.seekFood(food.pos);
        }
    }

    interactNear(thisAnt) {
        for (var j = 0; j < this.ants.length; j++) {
            var otherAnt = this.ants[j];
            if (thisAnt == otherAnt) continue;

            var relPos = p5.Vector.sub(otherAnt.pos, thisAnt.pos);
            var dist = relPos.mag();
            // they touch
            if (dist <= thisAnt.size + otherAnt.size) {
                // mate if different sex and mature
                if (this.canMate(thisAnt, otherAnt)) {
                    var newAnt = this.mate(thisAnt, otherAnt);
                    if (newAnt) this.addAnt(newAnt);

                    // eat if one is mature but not the other and same sex and not family
                } else if (this.canKill(thisAnt, otherAnt)) {
                    this.kill(thisAnt, otherAnt);
                } else {
                    thisAnt.avoid(otherAnt.pos); // maintain distance
                }
            }
        }
    }

    interactFar(thisAnt, otherAnt, closestDist) {
        // this ant can see other ant
        if (closestDist < thisAnt.mateSight && this.canMate(thisAnt, otherAnt)) {
            thisAnt.seekSex(otherAnt.pos);
        } else if (otherAnt.cannibal && closestDist < thisAnt.escapeSight && this.canKill(otherAnt, thisAnt)) {
            thisAnt.avoid(otherAnt.pos);
        } else if (thisAnt.cannibal && closestDist < thisAnt.eatSight && this.canKill(thisAnt, otherAnt)) {
            thisAnt.seekFood(otherAnt.pos);
        }
    }

    cannibal(thisAnt) {
        return this.ants.indexOf(thisAnt) > this.maxPop * 0.8;
    }

    canMate(thisAnt, otherAnt) {
        var cond = (thisAnt.sex + otherAnt.sex) == 1 &&
            this.ants.length < this.maxPop &&
            !this.isFamily(thisAnt, otherAnt) &&
            thisAnt.isMature() &&
            otherAnt.isMature() &&
            !thisAnt.cannibal &&
            !otherAnt.cannibal;

        return cond;
    }

    canKill(thisAnt, otherAnt) {
        var cond = thisAnt.cannibal && 
            !otherAnt.cannibal &&
            thisAnt.isMature() &&
            //!otherAnt.isMature() &&
            // this.sameSex(thisAnt, otherAnt) &&
            !this.isFamily(thisAnt, otherAnt);
        return cond;
    }

    sameSex(thisAnt, otherAnt) {
        return (thisAnt.sex + otherAnt.sex) % 2 == 0;
    }

    isFamily(thisAnt, otherAnt) {
        return thisAnt.parents.includes(otherAnt) ||
            otherAnt.parents.includes(thisAnt) ||
            thisAnt.babies.includes(otherAnt) ||
            otherAnt.babies.includes(thisAnt)
        || this.sameParent(thisAnt, otherAnt);
    }

    sameParent(thisAnt, otherAnt) {
        var cond = false;
        for (var i = 0; i < thisAnt.parents.length; i++) {
            for (var j = 0; j < otherAnt.parents.length; j++) {
                if (thisAnt.parents[i] == otherAnt.parents[j]) {
                    cond = true;
                    return cond;
                }
            }
        }
        return cond;
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
            this.deadAnts[i].makeShape();
            // rect(this.deadAnts[i].pos.x, this.deadAnts[i].pos.y, this.deadAnts[i].size, this.deadAnts[i].size);
        }
    }

}