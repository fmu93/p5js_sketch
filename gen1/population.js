class Population {

    constructor(m, n) {
        this.mutationRate = m;
        this.ants = [];
        this.generations = 0;
        this.maxPop = 500;
        for (var i = 0; i < n; i++) {
            this.addAnt();
        }
    }

    run() {
        // age ant and remove if dead
        this.age();

        for (var i = 0; i < this.ants.length; i++) {
            // check each other ant and mate or eat
            for (var j = i; j < this.ants.length; j++) {
                var relPos = p5.Vector.sub(this.ants[j].pos, this.ants[i].pos);
                if (relPos.mag() < this.ants[i].size + this.ants[j].size) {
                    // mate if different sex and mature
                    if (this.ants[i].sex + this.ants[j].sex == 1 &&
                        this.ants.length < this.maxPop &&
                        this.ants[i].isMature() &&
                        this.ants[j].isMature()) {

                        var couple = [this.ants[i], this.ants[j]];
                        var newAnt = this.mate(couple);

                        if (newAnt) this.ants.push(newAnt);
                    // eat if one is mature but not the other and same sex and not family
                    } else if (this.ants[i].isMature() &&
                        !this.ants[j].isMature() && 
                        (this.ants[i].sex + this.ants[j].sex) % 2 == 0 &&
                        !this.ants[i].isFamily(this.ants[j])) {
                           this.eat(this.ants[i], this.ants[j]);
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

    eat(eater, eated) {
        // eater takes age of eated and slows down
        eater.death += eated.age;
        eater.wanderForce *= 0.9;
        // eated gets death age
        eated.age = eated.death;
    }

    mate(couple) {
        // check that their partner is not their parent
        if (!couple[0].parents.includes(couple[1]) && !couple[1].parents.includes(couple[0]) &&
            !couple[0].babies.includes(couple[1].babies) &&
            (couple[0].babies.length + couple[1].babies.length < 3)) {

            var babyDNA = couple[0].dna.crossover(couple[1].dna);
            if (random() < this.mutationRate) {
                babyDNA.mutate();
            }

            var babyAnt = new Ant(couple[0].pos.copy(), (couple[0].size + couple[1].size) * 0.6, babyDNA);
            // keep track of family tree
            babyAnt.parents.push(couple[0]);
            babyAnt.parents.push(couple[1]);
            couple[0].babies.push(babyAnt);
            couple[1].babies.push(babyAnt);
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
            if (this.ants[i].isDead()) {
                this.ants.splice(i, 1);
            }
        }
    }

}