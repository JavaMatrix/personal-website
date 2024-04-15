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

function mobileCheck() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

let sparks = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    // frameRate(1);
    MINIMUM_POP = mobileCheck() ? 25 : ((windowWidth * 2 + windowHeight * 2) / 50) * 5;
    MAX_DISTANCE = createVector(width / 2, height / 2).mag();
    frameRate(120);
    background(0, 255);
    for (let i = 0; i < MINIMUM_POP / 2; i++) {
        sparks.push(createSpark());
    }
}

let panicTimer = 0;

function draw() {
    colorMode(RGB, 255);
    noStroke();
    background("#121212");

    console.log("SIM");
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

    if (deltaTime > 1000) { // it's been over a second, changed tabs or something
        panic();
    }

    if (fps < 40 && MINIMUM_POP > 25) {
        panicTimer += deltaTime;
        if (panicTimer > 500) {
            panic();
        }
    } else {
        panicTimer = 0;
    }
}

function panic() {
    MINIMUM_POP *= 0.8;
    sparks = [];
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}