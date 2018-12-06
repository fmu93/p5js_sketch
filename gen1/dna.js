class DNA {

    constructor(genes_) {
        if (genes_) {
            this.genes = genes_;
        } else {
            this.genes = [random(0, 0.5)]; // TODO [wander force, size, ]
        }
    }

    crossover(otherDNA) {
        var newGenes = [(this.genes[0] + otherDNA.genes[0])/2];

        return new DNA(newGenes);
    }

    mutate() {

        return this;

    }
}