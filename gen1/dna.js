class DNA {

    constructor(genes_) {
        if (genes_) {
            this.genes = genes_;
        } else {
            // [wander force, mate sight, eat sight, escape sight, maxspeed, maxforce, edges, size, avoidMaxSpeed, avoidForce]
            this.genes = [random(0.05, 0.2), // random force
                random(40, 170), // mate sight
                random(100, 170), // eat sight
                random(40, 170), // escape sight
                random(0.1, 8), // max eat speed
                random(0.01, 0.5), // max eat force
                random(0.1, 5), // max food speed
                random(0.01, 0.05), // max mate force
                random(0.1, 2), // avoid max speed
                random(0.01, 2), // avoid max force
                floor(random(3, 8)), // edges
                random(4, 50)]; // size
        }
    }

    updateGenes(newGenes) {
        this.genes = newGenes;
    }

    crossover(otherDNA) {
        var newGenes = [];
        for (var i = 0; i<this.genes.length; i++) {
            var pick = random();
            newGenes[i] = this.genes[i]*pick + otherDNA.genes[i]*(1-pick);
        }

        return new DNA(newGenes);
    }

    mutate() {
        //this.genes[floor(random(this.genes.length))] = random(0.2, 0.2);
        this.genes[floor(random(this.genes.length))] *= random(0.5, 2)
        return this;

    }
}