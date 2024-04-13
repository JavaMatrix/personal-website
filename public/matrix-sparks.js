const SPEED = 1;
const SIM_SPEED = 2;
const GRID_SIZE = 50;
let MINIMUM_POP = 0;
let MAX_DISTANCE = 0;
const ALPHA_REDUCE = 3;
const HIST_SZ = Math.floor(255 / ALPHA_REDUCE);

let simTime = 0;

let nextSparkID = 0;

function createSpark(position, velocity) {
    let id = nextSparkID++;
    let life =
        Math.floor(random(50.0 / GRID_SIZE, 100.0 / GRID_SIZE)) * GRID_SIZE;

    let pos, vel;

    if (position && velocity) {
        pos = position;
        vel = velocity;
    } else {
        const side = int(random(0, 4));
        const randomHeight = int(random(1, height / GRID_SIZE)) * GRID_SIZE;
        const randomWidth = int(random(1, width / GRID_SIZE)) * GRID_SIZE;
        switch (side) {
            case 0:
                pos = createVector(0, randomHeight);
                vel = createVector(SPEED, 0);
                break;
            case 1:
                pos = createVector(randomWidth, 0);
                vel = createVector(0, SPEED);
                break;
            case 2:
                pos = createVector(width, randomHeight);
                life += width % GRID_SIZE; // realign life to grid
                vel = createVector(-SPEED, 0);
                break;
            case 3:
                pos = createVector(randomWidth, height);
                life += height % GRID_SIZE; // realign life to grid
                vel = createVector(0, -SPEED);
                break;
            default:
                pos = createVector(0, 0);
                vel = createVector(0, 0);
                life = 0;
        }
    }

    let history = [];
    for (let i = 0; i < HIST_SZ; i++) {
        history.push(pos.copy());
    }

    return {
        id,
        pos,
        vel,
        life,
        death: 0,
        history,
        sHue: random([308, 180, 240]),
        canSplit: true,
    };
}

function updateSpark(spark) {
    spark.pos.add(spark.vel);

    spark.life -= 1;
    if (spark.life <= 0) {
        spark.death += 1;
    }

    spark.history.push(spark.pos.copy());

    if (spark.history.length > HIST_SZ) {
        spark.history.shift();
    }
}

function isSparkAlive(spark) {
    return spark.life > 0 || spark.death < spark.history.length;
}

function displaySpark(spark) {
    if (spark.history.length == 0) return;
    strokeWeight(1);

    // const hue = ((new Date()).getTime() / 1000) % 360;
    const hue = spark.sHue;
    colorMode(HSB);

    if (spark.history.length < 2) return;

    const head = spark.history[0];
    const tail = spark.history[spark.history.length - spark.death - 1];
    const end = spark.history[spark.history.length - 1];

    stroke(255, 255, 255); // this is needed for the below hack to work, else p5 doesn't acknowledge the color

    // hack out of p5 to use a gradient line
    const grad = this.drawingContext.createLinearGradient(
        head.x,
        head.y,
        end.x,
        end.y
    );
    grad.addColorStop(1, `hsl(${hue}deg, 50%, 70%)`);
    grad.addColorStop(0, `hsl(${hue}deg, 50%, 20%)`);
    this.drawingContext.strokeStyle = grad;

    line(head.x, head.y, tail.x, tail.y);
}

function killSpark(spark) {
    spark.life = 0;
    spark.canSplit = false;
}

let sparks = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    // frameRate(1);
    MINIMUM_POP = ((windowWidth * 2 + windowHeight * 2) / 50) * 5;
    MAX_DISTANCE = createVector(width / 2, height / 2).mag();
    frameRate(120);
    background(0, 255);
    for (let i = 0; i < MINIMUM_POP / 2; i++) {
        sparks.push(createSpark());
    }
}

let timer60 = 0;
let panicTimer = 0;

function draw() {
    colorMode(RGB, 255);
    noStroke();
    background("#121212");

    simTime += deltaTime;

    for (let sim = 0; sim < SIM_SPEED; sim++) {
        let deadSparks = [];
        for (let x = 0; x < sparks.length; x++) {
            const spark = sparks[x];
            if (!isSparkAlive(spark)) {
                sparks.splice(x, 1);
                continue;
            }

            updateSpark(spark);
            if (spark.life <= 0 && spark.canSplit) {
                deadSparks.push(spark);
            }
            if (
                spark.pos.x <= 0 ||
                spark.pos.x > width ||
                spark.pos.y <= 0 ||
                spark.pos.y > height
            ) {
                killSpark(spark);
            }

            // if (simTime > 1000) {
            //     let collisions = sparks.filter(
            //         (z) =>
            //             z.pos.x == spark.pos.x &&
            //             z.pos.y == spark.pos.y &&
            //             z.id != spark.id &&
            //             z.life > 0
            //     );
            //     if (collisions.length > 0) {
            //         killSpark(spark);
            //         for (const collider of collisions) {
            //             killSpark(collider);
            //         }
            //     }
            // }

            if (isSparkAlive(spark)) {
                displaySpark(spark);
            }
        }

        for (const dead of deadSparks) {
            dead.canSplit = false;

            if (random(MINIMUM_POP * 2) < sparks.length) continue; // scale down splits according to number of sparks

            const vels = [
                dead.vel,
                createVector(dead.vel.y, dead.vel.x),
                createVector(-dead.vel.y, -dead.vel.x),
            ];
            const shuffledVels = shuffle(vels);

            const spawnCount = Math.floor(random(1, 4));
            for (let i = 0; i < spawnCount; i++) {
                const vel = shuffledVels.pop();
                const spawn = createSpark(createVector(dead.pos.x, dead.pos.y), vel);
                displaySpark(spawn);
                sparks.push(spawn);
            }
        }

        sparks = sparks.filter((spark) => isSparkAlive(spark));

        while (sparks.length < MINIMUM_POP) {
            sparks.push(createSpark());
        }
    }

    let fps = frameRate();
    fill(255);
    // text(int(fps), 50, 50);
    // text(int(MINIMUM_POP), 50, 150);

    if (fps < 40) {
        panicTimer += deltaTime;
        if (panicTimer > 500) {
            MINIMUM_POP *= 0.8;
            while (sparks.length > MINIMUM_POP) {
                sparks.forEach((spark) => spark.life -= 1);
                sparks = sparks.filter((spark) => isSparkAlive(spark));
            }
            console.log("PANIC");
        }
    } else {
        panicTimer = 0;
    }

    if (fps > 59) {
        timer60 += deltaTime;
    } else {
        timer60 = 0;
    }

    if (timer60 > 1000) {
        MINIMUM_POP *= 1.05;
        timer60 = 0;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}