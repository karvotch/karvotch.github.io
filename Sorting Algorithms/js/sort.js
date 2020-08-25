function prepare(gameSpeed) {
    canv = document.getElementById("mainCanvas");

        // Setting the width and length of the canvas 
            // to the width and length of the monitor to perfectly fit the screen.
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;

    min = 0;
    maxRange = 100;
    max = maxRange;

    barWidth = canv.width / maxRange;
    barHeight = canv.height / maxRange;

        // The deltaTime and lastFrame variables are being used to interval the game logic.
            // This is necessary to separate game logic from game rendering.
                // This creates a smooth experience of navigating the sandbox.
                // The game rendering and game logic used to be interlocked resulting in the navigation of the
                    // sandbox to be locked to the speed of the game logic. This can be painful when game logic
                        // is slowed down for testing or placing cells.
    deltaTime = 0;
    lastFrame = 0;
    startTime = 0;
    totalTime = 0;

        // This boolean is used when pausing the game logic to place cells.
    pauseGame = false;

        // The interval speed for game logic.
        // The variable uses milliseconds to determine game logic 
            // (100 = 100 milliseconds until the next call to game logic).
    gameLogicSpeed = gameSpeed;

        // How many times the game has been drawn or rendered.
    count = 0;
    count2 = 0;
    isSwitch = false;

    intArray = [];
    for(var i = 0; i < maxRange; i++) {
        intArray.push(i);
    }

    for(var i = 0; i < 200; i++) {
        let rand1 = getRandomInt(min, maxRange);
        let rand2 = getRandomInt(min, maxRange);
        let temp1 = intArray[rand1];
        intArray[rand1] = intArray[rand2];
        intArray[rand2] = temp1;
    }

    previousMerge = [];
    endOfArray = false;
    finished = false;
}

function render() {
    // console.log('HELLO');
    count += 1;
        // These variables are dealing with the delta time between frames.
    let currentFrame = Date.now();
    deltaTime += currentFrame - lastFrame;
    lastFrame = currentFrame;
    //console.log(currentFrame + " " + deltaTime + " " + lastFrame);

        // This loop deals with game logic.
    if(deltaTime >= gameLogicSpeed && !pauseGame) {
        // console.log('hello');
        deltaTime = 0;
        // count2 +=1;

        sortFunc();
        if(max == 2) {
            pauseGame = true;
            console.log(Date.now() - startTime);
        }
    }


    
    
        // Call the draw function.
            // This is used if the window is resized.
    draw();

        // Select a color and fill the whole screen with it.
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canv.width, canv.height);

        // Select another color.
    ctx.fillStyle = "black";
    for(var i = 0; i < 100; i++) {
        ctx.fillRect(i * barWidth, canv.height, barWidth, -(intArray[i] * barHeight));
    }
        // Loop the same function we are in.
    window.requestAnimationFrame(render);
}

function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
        max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function getRandomInt(min, max) {
      min = Math.ceil(min);
        max = Math.floor(max);
          return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive 
}

    // An event listener for keyboard presses.
function keyPush(evt) {
    switch (evt.keyCode) {
        case 37:
            break;
        case 38:
            break;
        case 39:
            break;
        case 40:
            break;
        case 32:
            pauseGame = !pauseGame;
            break;
    }
}


    // The draw function that deals with window resizing.
function draw() {
    canv.width  = window.innerWidth;
    canv.height = window.innerHeight;

    barWidth = canv.width / maxRange;
    barHeight = canv.height / maxRange;
}

prepare(100);