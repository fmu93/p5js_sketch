class DNA {

    constructor(genes_) {
        if (genes_) {
            this.genes = genes_;
        } else {
            // TODO [wander force, mate force, eat force, escape force, sight]
            this.genes = [random(0.5, 0.5), random(0.5, 0.5), random(0.5, 0.5), random(0.5, 0.5), random(20, 100)]; 
        }
    }

    crossover(otherDNA) {
        var newGenes = [];
        for (var i = 0; i<this.genes.length; i++) {
            newGenes[i] = (this.genes[i] + otherDNA.genes[i])/2;
        }

        return new DNA(newGenes);
    }

    mutate() {
        this.genes[floor(random(this.genes.length))] = random(0, 0.5);
        return this;

    }
}