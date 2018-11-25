var ants = [];
var n = 100;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);

    for (var i = 0; i < n; i++) {
        ants.push(new Ant());
    }
}

function draw() {
    background(0);

    for (var i = ants.length-1; i >= 0; i--) {
        ants[i].wander();
        for (var j = ants.length-1; j >= i; j--) {
            var relPos = p5.Vector.sub(ants[j].pos, ants[i].pos);
            if (relPos.magSq() < 100 && (ants[i].sex + ants[j].sex == 1)) {
                
                var newAnt = ants[i].mate(ants[i], ants[j]);
                if (newAnt) ants.push(newAnt);
            }
        }
    }


    for (var i = ants.length-1; i >= 0; i--) {
        var dead = ants[i].mature();
        if (dead) {
            ants.splice(i, 1);
            continue;
        }
        ants[i].walls();
        ants[i].update();
        ants[i].friction();
        ants[i].show();
    }

}