class DNA {

    constructor(genes_) {
        if (genes_) {
            this.genes = genes_;
        } else {
            // [wander force, mate sight, eat sight, escape sight, maxspeed, maxforce, edges, size, avoidMaxSpeed, avoidForce]
            this.genes = [randomGaussian(2, 0.5), // wander speed
                randomGaussian(150, 50), // mate sight
                randomGaussian(150, 50), // eat sight
                randomGaussian(150, 50), // escape sight
                randomGaussian(2, 0.2), // max eat speed
                randomGaussian(0.05, 0.01), // max eat force
                randomGaussian(2, 0.2), // max mate speed
                randomGaussian(0.05, 0.01), // max mate force
                randomGaussian(2, 0.2), // avoid max speed
                randomGaussian(0.05, 0.01), // avoid max force
                random(3, 8), // edges
                random(8, 50), // size
                random(2), // sex
                random(100, 200), // maturity
                randomGaussian(500, 50), // life
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
        // pick a single gene and randomize
        this.genes[floor(random(this.genes.length))] *= random(0.5, 2)
        return this;

    }
}