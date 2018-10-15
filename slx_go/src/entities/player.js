class Player {
    constructor() {
        this.pos = new position(this, 300, 300);
        this.img = new animator(this, this.pos, "roshanB", 4, 4, .25);
        this.speed = 5;

        this.properties = [
            this.pos,
            this.img,
            this.speed
        ];
        objects.push(this);
    }

    step() {
        if (keyIsDown(DOWN_ARROW)) {
            this.move(0);
        } else if (keyIsDown(LEFT_ARROW)) {
            this.move(1);
        } else if (keyIsDown(RIGHT_ARROW)) {
            this.move(2);
        } else if (keyIsDown(UP_ARROW)) {
            this.move(3);
        }
    }

    move(index) {
        switch (index) {
            case 0:
                this.pos.y += this.speed;
                this.img.setY(index);
                break;
            case 1:
                this.pos.x -= this.speed;
                this.img.setY(index);
                break;
            case 2:
                this.pos.x += this.speed;
                this.img.setY(index);
                break;
            case 3:
                this.pos.y -= this.speed;
                this.img.setY(index);
                break;
        }
        this.img.animateX();
    }
}