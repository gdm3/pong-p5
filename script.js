const canvasWidth = 900
const canvasHeight = 600
//Cannot go over 60
const _frameRate = 60
let sensitivity = 5
let canvas
let balls = []
let boundaries = []
let controllers = []
let game
let obj_down = {}
let gameModed = "twoPlayer"
let curGamemodeName = 'Two Player'
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



//Game Class - Handles menus + game
class Game {
    constructor(type) {
        this.type = type
        this.labelFont = loadFont("EightBitDragon-anqx.ttf")
    }
    //End of each game - on death - will change later
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
    //runs from the p5 setup function - no options menu - not needed!
    run() {
        if (this.type == "AI") {
            this.aiStart()
        }
        if (this.type == "twoPlayer") {
            this.twoPlayerStart()
        }
        if (this.type == "none") {
            this.noneStart()
        }
    }
    //handles button hover events
    endButtonHover(button) {
        button.buttonHovered = false;
    }
    startButtonHover(button) {

        button.buttonHovered = true;
    }
    //seperate button clicked functions

    startButtonClicked() {
        this.type = gameModed
        if(this.type == "twoPlayer"){
            this.twoPlayerStart()
        } else if(this.type == "AI"){
            this.aiStart()
        }
        this.startButton.hide()
        this.optionsButton.hide()

    }
    aiButtonClicked() {
        gameModed = "AI"
    }
    twoPlayerButtonClicked(){
        gameModed = 'twoPlayer'
    }
    optionsButtonClicked() {
        this.type = "options"
        this.optionsStart()
        this.startButton.hide()
        this.optionsButton.hide()
    }
    backButtonClicked(){
        this.type = "none"
        this.noneStart()
        this.startButton.show()
        this.optionsButton.show()
        this.backButton.hide()
        this.aiButton.hide()
        this.twoPlayerButton.hide()
    }
    noneStart() {
        //Create start button
        this.titleFont = loadFont("Blippo Bold.ttf")
        this.startButton = createButton("Start")
        this.startButton.style("position", "absolute")
        this.startButton.style("left", window.innerWidth / 2 - 55 + "px")
        this.startButton.style("top", window.innerHeight / 2 - 45 + "px")
        this.startButton.size(90, 40)
        this.startButton.mouseOver(this.startButtonHover.bind(this, this.startButton))
        this.startButton.mouseOut(this.endButtonHover.bind(this, this.startButton))
        this.startButton.mouseClicked(this.startButtonClicked.bind(this))
        this.startButton.style("background-color", "transparent")
        this.startButton.style("color", "white")
        this.startButton.style('border', '1px solid white')
        this.startButton.style("font-family", "textFont")

        this.optionsButton = createButton("Options")
        this.optionsButton.style("position", "absolute")
        this.optionsButton.style("left", window.innerWidth / 2 - 55 + "px")
        this.optionsButton.style("top", window.innerHeight / 2 + 10 + "px")
        this.optionsButton.size(90, 40)
        this.optionsButton.mouseOver(this.startButtonHover.bind(this, this.optionsButton))
        this.optionsButton.mouseOut(this.endButtonHover.bind(this, this.optionsButton))
        this.optionsButton.mouseClicked(this.optionsButtonClicked.bind(this))
        this.optionsButton.style("background-color", "transparent")
        this.optionsButton.style("color", "white")
        this.optionsButton.style('border', '1px solid white')
        this.optionsButton.style("font-family", "textFont")
    }
    optionsStart(){
        this.backButton = createButton("Back")
        this.backButton.style("position", "absolute")
        this.backButton.style("left", window.innerWidth / 2 - 55 + "px")
        this.backButton.style("top", window.innerHeight / 2 + 200 + "px")
        this.backButton.size(90, 40)
        this.backButton.mouseOver(this.startButtonHover.bind(this, this.backButton))
        this.backButton.mouseOut(this.endButtonHover.bind(this, this.backButton))
        this.backButton.mouseClicked(this.backButtonClicked.bind(this))
        this.backButton.style("background-color", "transparent")
        this.backButton.style("color", "white")
        this.backButton.style('border', '1px solid white')
        this.backButton.style("font-family", "textFont")

        this.twoPlayerButton = createButton("Two Players")
        this.twoPlayerButton.style("position", "absolute")
        this.twoPlayerButton.style("left", window.innerWidth / 2 - 400 + "px")
        this.twoPlayerButton.style("top", window.innerHeight / 2 - 215 + "px")
        this.twoPlayerButton.size(90, 40)
        this.twoPlayerButton.mouseOver(this.startButtonHover.bind(this, this.twoPlayerButton))
        this.twoPlayerButton.mouseOut(this.endButtonHover.bind(this, this.twoPlayerButton))
        this.twoPlayerButton.mouseClicked(this.twoPlayerButtonClicked.bind(this))
        this.twoPlayerButton.style("background-color", "transparent")
        this.twoPlayerButton.style("color", "white")
        this.twoPlayerButton.style('border', '1px solid white')
        this.twoPlayerButton.style("font-family", "textFont")

        this.aiButton = createButton("One Player")
        this.aiButton.style("position", "absolute")
        this.aiButton.style("left", window.innerWidth / 2 - 400 + "px")
        this.aiButton.style("top", window.innerHeight / 2 - 165 + "px")
        this.aiButton.size(90, 40)
        this.aiButton.mouseOver(this.startButtonHover.bind(this, this.aiButton))
        this.aiButton.mouseOut(this.endButtonHover.bind(this, this.aiButton))
        this.aiButton.mouseClicked(this.aiButtonClicked.bind(this))
        this.aiButton.style("background-color", "transparent")
        this.aiButton.style("color", "white")
        this.aiButton.style('border', '1px solid white')
        this.aiButton.style("font-family", "textFont")
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
        textFont(this.titleFont)
        textSize(60)
        text("PONG", canvasWidth / 2 - 85, canvasHeight / 3.5)

        if (this.startButton.buttonHovered === true) {
            this.startButton.style('border', '1px solid gray')
            this.startButton.style('color', 'gray')
        } else {
            this.startButton.style('border', '1px solid white')
            this.startButton.style('color', 'white')
        }
        if (this.optionsButton.buttonHovered === true) {
            this.optionsButton.style('border', '1px solid gray')
            this.optionsButton.style('color', 'gray')
        } else {
            this.optionsButton.style('border', '1px solid white')
            this.optionsButton.style('color', 'white')
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

    optionsUpdate() {
        if(gameModed == "twoPlayer"){
            curGamemodeName = "Two Player"
        }
        else{
            curGamemodeName = "One Player"
        }

        background(0);
        fill(255, 255, 255)
        textFont(this.labelFont)
        textSize(20)
        text("GameMode Selection", 10, 30)
        text("Current GameMode: " + curGamemodeName, 10, 60)

        if (this.backButton.buttonHovered === true) {
            this.backButton.style('border', '1px solid gray')
            this.backButton.style('color', 'gray')
        } else {
            this.backButton.style('border', '1px solid white')
            this.backButton.style('color', 'white')
        }
        if (this.aiButton.buttonHovered === true) {
            this.aiButton.style('border', '1px solid gray')
            this.aiButton.style('color', 'gray')
        } else {
            this.aiButton.style('border', '1px solid white')
            this.aiButton.style('color', 'white')
        }
        if (this.twoPlayerButton.buttonHovered === true) {
            this.twoPlayerButton.style('border', '1px solid gray')
            this.twoPlayerButton.style('color', 'gray')
        } else {
            this.twoPlayerButton.style('border', '1px solid white')
            this.twoPlayerButton.style('color', 'white')
        }

    }

    update() {
        //run each update function
        if (this.type === "AI") {
            this.aiUpdate()
        } else if (this.type === "none") {
            this.noneUpdate()
        } else if (this.type === "twoPlayer") {
            this.twoPlayerUpdate()
        } else if (this.type === "options") {
            this.optionsUpdate()
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