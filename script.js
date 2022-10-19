const canvH = 600
const canvW = 900
let canvas
let balls = []
let boundries = []




class Controller {
    constructor(startx, starty, width, length){
        this.pos = createVector(startx, starty)
        this.w = width
        this.l = length
    }
    draw(){
        rect(this.pos.x, this.pos.y, this.w, this.l)
    }
}
class Boundry {
    //class for p5 line collisions
    //isHoriz is whether the boundary is horizontal or vertical
    constructor(startx, starty, endx, endy, isHoriz) {
        this.start = createVector(startx, starty);
        this.end = createVector(endx, endy);
        this.horizontal = isHoriz;
    }
}

class Ball {
    constructor(x, y, rad) {
        this.pos = createVector(x, y)
        this.rad = rad
        this.vel = createVector(1, -1)
        this.accel = createVector(0, 0)
    }

    draw() {
        circle(this.pos.x, this.pos.y, this.rad * 2)
    }

    update() {
        //Check for collisions on edge
        boundries.forEach((boundry) => {
            let isColliding = collideLineCircle(boundry.start.x, boundry.start.y, boundry.end.x, boundry.end.y, this.pos.x, this.pos.y, this.rad * 2)
            if (isColliding === true) {
                //check if boundry is horizontal or veritcal
                if (boundry.horizontal === true) {
                    this.vel.y = this.vel.y / -1;
                } else {
                    this.vel.x = this.vel.x / -1;
                }
            }
        });
        //Add acceleration to velocity
        this.vel.add(this.accel);
        //zero acceleration - avoids p5 warning message by not usage .div()
        this.accel.x = 0
        this.accel.y = 0
        //Add velocity to position
        this.pos.add(this.vel)

    }
}

function setup() {
    canvas = createCanvas(canvW, canvH)
    //Position canvas in middle
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y);
    //Set framerate
    frameRate(60)
    //Create objects
    balls.push(new Ball(200, 200, 25))
    //Create boundaries
    boundries.push(new Boundry(0, 1, 900, 1, true)) //Top
    boundries.push(new Boundry(0, 599, 900, 599, true)) // Bottom
    boundries.push(new Boundry(1, 0, 1, 600, false)) //Left
    boundries.push(new Boundry(899, 0, 899, 600, false)) //Right

}

function draw() {
    //set background
    background(0);
    //update physics
    balls.forEach(function (ball) {
        ball.update();
    });

    //draw balls
    balls.forEach(function (ball) {
        ball.draw();
    });
}

