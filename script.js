const canvasWidth = 900
const canvasHeight = 600
//Cannot go over 60
const _frameRate = 60
let sensitivity = 5
let canvas
let balls = []
let boundaries = []
let controllers = []
let keyRelease = true
let game
let obj_down = {}
let gui
let gameMode = ["AI, Two Player"]
let skill = 20
//Key Handler
window.addEventListener("keydown", function (ev) {
    if (obj_down[event.key]) {

        // prevent multiple triggering
        return
    }
    obj_down[ev.keyCode] = true;
    console.log(ev.keyCode)

    if (obj_down["a"] && obj_down["d"]) {
        console.log("a and d were pressed together! score++");
    }
})

window.addEventListener("keyup", function (ev) {
    delete obj_down[ev.keyCode];
})

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */

class Button {
    constructor(x1, x2, w, h, text, outline, outlineBordSize) {

    }
    clicked(){

        return false;
    }
    update(){

    }
    draw(){

    }
}
class Game {
    constructor(type) {
        this.type = type

    }

    end() {
        if (this.type == "AI") {
            balls = []
            boundaries = []
            controllers = []
        } else if (this.type == "twoPlayer") {
            balls = []
            boundaries = []
            controllers = []
        }
    }

    run() {
        if (this.type == "AI") {
            this.aiStart()
        }
        if (this.type == "twoPlayer") {
            this.twoPlayerStart()
        }
        if(this.type == "none"){
            this.noneStart()
        }
    }
    endButtonHover(button){
        button.buttonHovered = false;
    }
    startButtonHover(button){

        button.buttonHovered = true;
    }
    startButtonClicked(){
        this.type = "twoPlayer"
        this.twoPlayerStart()
        this.startButton.hide()

    }
    noneStart(){
        //Create start button
        this.font = loadFont("Blippo Bold.ttf")
        this.startButton = createButton("Start")
        this.startButton.style("position", "absolute")
        this.startButton.style("left", window.innerWidth / 2  - 45 + "px")
        this.startButton.style("top", window.innerHeight / 2  - 45 + "px")
        this.startButton.size(70, 30)
        this.startButton.mouseOver(this.startButtonHover.bind(this, this.startButton))
        this.startButton.mouseOut(this.endButtonHover.bind(this, this.startButton))
        this.startButton.mouseClicked(this.startButtonClicked.bind(this))
        this.startButton.style("background-color", "transparent")
        this.startButton.style("color", "white")
        this.startButton.style('border', '1px solid white')



    }
    twoPlayerStart() {
        //if game is ai then start ai game here - create arrays and stuff
        balls.push(new Ball(canvasWidth / 2 + 1, canvasHeight / 2, 10))
        //Create boundaries
        boundaries.push(new Boundry(0, 1, 900, 1, true, false)) //Top
        boundaries.push(new Boundry(0, 599, 900, 599, true, false)) // Bottom
        boundaries.push(new Boundry(1, 0, 1, 600, false, true)) //Left
        boundaries.push(new Boundry(899, 0, 899, 600, false, true)) //Right
        //Create controller
        let controller = new playerController(5, canvasHeight / 2, 10, 60, 38, 40)
        controllers.push(controller)
        //q and a
        controller = new playerController(canvasWidth - 15, canvasHeight / 2, 10, 60, 81, 65)
        controllers.push(controller)
    }

    aiStart() {
        //if game is ai then start ai game here - create arrays and stuff
        balls.push(new Ball(canvasWidth / 2, canvasHeight / 2, 10))
        //Create boundaries
        boundaries.push(new Boundry(0, 1, 900, 1, true, false)) //Top
        boundaries.push(new Boundry(0, 599, 900, 599, true, false)) // Bottom
        boundaries.push(new Boundry(1, 0, 1, 600, false, true)) //Left
        boundaries.push(new Boundry(899, 0, 899, 600, false, true)) //Right
        //Create controller
        let controller = new playerController(5, canvasHeight / 2, 10, 60, 38, 40)
        controllers.push(controller)
        //create AI controller
        let aiController1 = new aiController(885, canvasHeight / 2, 10, 60, 3, 1)
        controllers.push(aiController1)
    }

    aiUpdate() {
        //set background
        background(0);
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

    noneUpdate() {
        background(0);
        fill(255, 255, 255)
        textFont(this.font)
        textSize(60)
        let txt = text("PONG", canvasWidth / 2 - 85, canvasHeight / 3.5)

        if(this.startButton.buttonHovered === true){
            this.startButton.style('border', '1px solid gray')
            this.startButton.style('color', 'gray')
        } else{
            this.startButton.style('border', '1px solid white')
            this.startButton.style('color', 'white')
        }

    }

    twoPlayerUpdate() {
        //set background
        background(0);
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

    update() {
        if (this.type == "AI") {
            this.aiUpdate()
        } else if (this.type == "none") {
            this.noneUpdate()
        } else if (this.type == "twoPlayer") {
            this.twoPlayerUpdate()
        }
    }

}

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
            if (!(this.pos.y < 4)) {
                this.pos.y -= this.speed
            }

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
        this.accel = createVector(0, 0)
        this.vel = createVector(0, 0)
    }

    draw() {
        rect(this.pos.x, this.pos.y, this.w, this.h)
    }

    down() {
        if (!(this.pos.y + this.h + sensitivity > canvasHeight - 4)) {
            //this.pos.y = this.pos.y + sensitivity
            this.accel.y += sensitivity / 4
        }

    }

    up() {
        if (!(this.pos.y - sensitivity < 4)) {
            //this.pos.y = this.pos.y - sensitivity
            this.accel.y -= sensitivity / 4
        }

    }

    update() {
        if (obj_down[this.keyBindUp]) {
            this.up()
        } else if (obj_down[this.keyBindDown]) {
            this.down()
        }
        this.vel.add(this.accel)

        if (this.vel.y > sensitivity * 8) {
            this.vel.y = sensitivity * 8
            console.log("g")
        } else if (this.vel.y < sensitivity * -8) {
            this.vel.y = sensitivity * -8
        }
        this.accel.x = 0
        this.accel.y = 0
        this.pos.add(this.vel)
        this.vel.y = this.vel.y / 1.05
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
                if (boundry.doesEnd === true) {
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


function death() {
    game.end()
    game.run()
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
    game = new Game("none")
    game.run()

}

function draw() {
    game.update()
}

console.log(setup, draw)