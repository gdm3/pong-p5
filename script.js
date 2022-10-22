const canvasWidth = 900
const canvasHeight = 600
//Cannot go over 60
const _frameRate = 60
let sensitivity = 5
let canvas
let balls = []
let boundaries = []
let players = []
let controllers = []
let keyRelease = true

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

class aiController {
    constructor(startpositionx, startpositiony, width, length, speed, speedUpChance) {
        this.pos = createVector(startpositionx, startpositiony)
        this.w = width
        this.h = length
        this.speed = speed
        this.speedUpChance = speedUpChance
        console.log(this.speedUpChance)
    }

    draw() {
        rect(this.pos.x, this.pos.y, this.w, this.h)
    }

    update() {
        let closestX = []
        let closestInv = []
        let _closest

        let obj
        //get balls with positive velocities
        balls.forEach((ball) => {
            if (Math.sign(ball.vel.x) === 1) {
                closestX.push(ball)
            } else {
                closestInv.push(ball)
            }

        })
        if (closestX.length === 0) {
            _closest = Math.min(...closestInv.map(o => o.pos.x))
            obj = closestInv.find(function (o) {
                return o.pos.x === _closest;
            })
        } else {
            //get ball closest to AI
            _closest = Math.max(...closestX.map(o => o.pos.x))
            obj = closestX.find(function (o) {
                return o.pos.x === _closest;
            })
        }
        //make target move words ball
        if (obj.pos.y < (((this.pos.y + length) - this.pos.y) / 2) + this.pos.y) {
            this.pos.y -= this.speed
        } else if (obj.pos.y > (((this.pos.y + length) - this.pos.y) / 2) + this.pos.y) {
            if (!(this.pos.y + this.h > (canvasHeight - 4))) {
                this.pos.y += this.speed
            }
        }
    }
}

class playerController {
    constructor(startpositionx, startpositiony, width, length, keybindUp, keybindDown) {
        this.pos = createVector(startpositionx, startpositiony)
        this.w = width
        this.h = length
        this.keyBindUp = keybindUp;
        this.keyBindDown = keybindDown;
    }

    draw() {
        rect(this.pos.x, this.pos.y, this.w, this.h)
    }

    down() {
        if (!(this.pos.y + this.h + sensitivity > canvasHeight - 4)) {
            this.pos.y = this.pos.y + sensitivity
        }

    }

    up() {
        if (!(this.pos.y - sensitivity < 4)) {
            this.pos.y = this.pos.y - sensitivity
        }

    }

    update() {
    }

}

class Boundry {
    //class for p5 line collisions
    //isHoriz is whether the boundary is horizontal or vertical
    constructor(startx, starty, endx, endy, isHoriz, endGame) {
        this.start = createVector(startx, starty);
        this.end = createVector(endx, endy);
        this.horizontal = isHoriz;
        this.doesEnd = endGame;
    }
}

class Ball {
    constructor(x, y, rad) {
        this.pos = createVector(x, y)
        this.rad = rad
        this.vel = createVector(0, 0)
        let xAccel
        let yAccel
        //create two variables xaccel and yaccel and add the random arbitrary value to them
        if (Math.random() < .5) {
            xAccel = getRandomArbitrary(-3, -2)
        } else {
            xAccel = getRandomArbitrary(2, 3)
        }
        if (Math.random() < .5) {
            yAccel = getRandomArbitrary(-3, -2)
        } else {
            yAccel = getRandomArbitrary(2, 3)
        }
        //log
        console.warn(xAccel, yAccel)
        //add to acceleration - zerored every frame
        this.accel = createVector(xAccel, yAccel)
        this.timeout = false;
        setInterval(this.resetTimeout.bind(this), 250)
    }

    draw() {
        circle(this.pos.x, this.pos.y, this.rad * 2)
    }

    resetTimeout() {
        this.timeout = false
    }


    update() {


        //Check for collisions on controllers - use controllers not players
        controllers.forEach((controller) => {
            if (this.timeout === false) {
                let isColliding = collideRectCircleVector(createVector(controller.pos.x, controller.pos.y), createVector(controller.w, controller.h), this.pos, this.rad * 2)
                if (isColliding === true) {
                    this.vel.x = this.vel.x / -1;
                    this.vel.x = this.vel.x * 1.4;

                    //check if vectorX is too high to prevent distortion
                    if ((this.vel.x / this.vel.y) > 1.5) {
                        console.log("took effect")
                        this.vel.y += getRandomArbitrary(-3, 3)
                    } else {
                        this.vel.y += getRandomArbitrary(-1, 1)
                    }
                    if (this.vel.x > 10) {
                        this.vel.x = 10
                    } else if (this.vel.x < -10)
                        this.vel.x = -10
                    this.timeout = true;
                }
            }

        })
        //Check for collisions on edge
        boundaries.forEach((boundry) => {
            let isColliding = collideLineCircle(boundry.start.x, boundry.start.y, boundry.end.x, boundry.end.y, this.pos.x, this.pos.y, this.rad * 2)
            if (isColliding === true) {
                //check if won game
                if (boundry.doesEnd === true){
                    death()
                }
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


function keyPressed() {
    keyRelease = false
}

function keyReleased() {
    keyRelease = true

}


function death() {
    //reset class lists and push new ones
    balls = []
    balls.push(new Ball(canvasWidth / 2, canvasHeight / 2, 25))
    controllers = []
    players = []
    let controller = new playerController(5, canvasHeight / 2, 10, 80, 38, 40)
    players.push(controller)
    controllers.push(controller)
    let aiController1 = new aiController(885, canvasHeight / 2, 10, 80, 2, 1)
    controllers.push(aiController1)
    console.log(balls, players, controllers)
}

function setup() {

    canvas = createCanvas(canvasWidth, canvasHeight)
    //Position canvas in middle
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y);
    //Set framerate
    frameRate(_frameRate)
    //Create objects
    balls.push(new Ball(canvasWidth / 2, canvasHeight / 2, 25))
    //Create boundaries
    boundaries.push(new Boundry(0, 1, 900, 1, true, false)) //Top
    boundaries.push(new Boundry(0, 599, 900, 599, true, false)) // Bottom
    boundaries.push(new Boundry(1, 0, 1, 600, false, true)) //Left
    boundaries.push(new Boundry(899, 0, 899, 600, false, true)) //Right
    //Create controller
    let controller = new playerController(5, canvasHeight / 2, 10, 80, 38, 40)
    players.push(controller)
    controllers.push(controller)
    //create AI controller
    let aiController1 = new aiController(885, canvasHeight / 2, 10, 80, 2, 1)
    controllers.push(aiController1)
}

function draw() {
    //set background
    background(0);
    //check for keys pressed
    players.forEach((player) => {
        if (keyRelease === false) {
            if (keyCode === player.keyBindUp) {
                player.up()
            } else if (keyCode === player.keyBindDown) {
                player.down()
            }
        }
    })
    //update physics

    balls.forEach(function (ball) {
        ball.update();
    });
    controllers.forEach((controller) => {
        controller.update()
    })

    //draw balls
    balls.forEach(function (ball) {
        ball.draw();
    });
    //draw player controllers
    controllers.forEach((controller) => {
        controller.draw()
    })
}


console.log(keyPressed, keyReleased, setup, draw)