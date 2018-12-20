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
                randomGaussian(3, 0.1), // max eat speed
                random(0.08), // max eat force
                random(6), // max mate speed
                random(0.05), // max mate force
                random(10), // avoid max speed
                random(0.08), // avoid max force
                random(3, 8), // edges
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