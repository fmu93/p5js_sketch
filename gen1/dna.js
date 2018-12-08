class DNA {

    constructor(genes_) {
        if (genes_) {
            this.genes = genes_;
        } else {
            // [wander force, mate sight, eat sight, escape sight, maxspeed, maxforce, edges, size]
            this.genes = [random(0.1, 0.5), random(0, 500), random(0, 500), random(0, 500), random(0, 2), random(0, 2), floor(random(3, 8)), random(10, 80)]; 
        }
    }

    updateGenes(newGenes) {
        this.genes = newGenes;
    }

    crossover(otherDNA) {
        var newGenes = [];
        for (var i = 0; i<this.genes.length; i++) {
            newGenes[i] = (this.genes[i] + otherDNA.genes[i])/2;
        }

        return new DNA(newGenes);
    }

    mutate() {
        //this.genes[floor(random(this.genes.length))] = random(0.2, 0.2);
        this.genes[floor(random(this.genes.length))] *= random(0.5, 2)
        return this;

    }
}