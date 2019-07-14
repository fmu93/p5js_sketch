var player;

function preload() {
    new rawImage("roshanB");
}

function setup() {
    Screen.init();
    frameRate(30);

    player = new Player();
}

function step() {

}

function keyPressed() {
    if (key == " ") {
        player.jump();
    }
}