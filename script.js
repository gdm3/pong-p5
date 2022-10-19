const canvH = 600
const canvW = 900
let canvas
let balls = []

class Ball {
    constructor(x, y, rad) {
        this.pos = createVector(x, y)
        this.rad = rad
        this.vel = createVector(1, 1)
        this.accel = createVector(0, 0)
    }

    draw() {
        circle(this.pos.x, this.pos.y, this.rad * 2)
    }
    update(){
        //Add acceleration to velocity
        this.vel.add(this.accel);
        this.accel.div(0)
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

}

function draw() {
    //set background
    background(0);
    //update physics
    balls.forEach(function(ball){
        ball.update();
    });

    //draw balls
    balls.forEach(function(ball){
        ball.draw();
    });



}