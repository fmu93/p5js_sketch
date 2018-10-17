class Player {
    constructor() {
        this.pos = new position(this, 300, 300);
        this.img = new animator(this, this.pos, "roshanB", 4, 4, .25);
        this.speed = 5;
        this.jumpY = 10;
        this.jumpT = 30;

        this.properties = [
            this.pos,
            this.img,
            this.speed
        ];
        
        this.jumpArray = [];
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

        if (key == " ") {
            // this.jump();
        }

        if (this.jumpArray[this.jumpArray.length-1]) {
            this.pos.y += this.jumpArray[this.jumpArray.length-1];
            this.jumpArray.pop();
        }
    }

    jump() {
        console.log("jump!");
        //this.jumpArray = [];
        for (var i = 0; i < this.jumpT; i++) {
            this.jumpArray.push(this.jumpY*cos(map(i, 0, this.jumpT, 0, PI)));
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