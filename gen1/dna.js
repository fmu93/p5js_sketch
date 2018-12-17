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
                random(6), // max eat speed
                random(0.08), // max eat force
                random(6), // max mate speed
                random(0.05), // max mate force
                random(2), // avoid max speed
                random(0.05), // avoid max force
                floor(random(3, 8)), // edges
                random(4, 50), // size
                random(2), // sex
                random(100, 200), // maturity
                random(500, 600), // life
                random(360) // hue
            ]; 
        }
    }

    updateGenes(newGenes) {
        this.genes = newGenes;
    }

    crossover(otherDNA) {
        var newGenes = [];
        for (var i = 0; i < this.genes.length; i++) {
            var pick = random();
            newGenes[i] = this.genes[i] * pick + otherDNA.genes[i] * (1 - pick);
        }

        return new DNA(newGenes);
    }

    mutate() {
        //this.genes[floor(random(this.genes.length))] = random(0.2, 0.2);
        this.genes[floor(random(this.genes.length))] *= random(0.5, 2)
        return this;

    }
}