let callSort4 = function() {
    startTime = Date.now();
    ctx = canv.getContext("2d");

    document.addEventListener("keydown", keyPush);
    sortFunc = sort4;
    prepare(50);
    render();
};


// canv = document.getElementById("mainCanvas");

//     // Setting the width and length of the canvas 
//         // to the width and length of the monitor to perfectly fit the screen.
// canv.width = window.innerWidth;
// canv.height = window.innerHeight;

// min = 0;
// maxRange = 100;
// max = maxRange;

// barWidth = canv.width / maxRange;
// barHeight = canv.height / maxRange;

//     // The deltaTime and lastFrame variables are being used to interval the game logic.
//         // This is necessary to separate game logic from game rendering.
//             // This creates a smooth experience of navigating the sandbox.
//             // The game rendering and game logic used to be interlocked resulting in the navigation of the
//                 // sandbox to be locked to the speed of the game logic. This can be painful when game logic
//                     // is slowed down for testing or placing cells.
// deltaTime = 0;
// lastFrame = 0;
// startTime = 0;
// totalTime = 0;

//     // This boolean is used when pausing the game logic to place cells.
// pauseGame = false;

//     // The interval speed for game logic.
//     // The variable uses milliseconds to determine game logic 
//         // (100 = 100 milliseconds until the next call to game logic).
// gameLogicSpeed = 100;

//     // How many times the game has been drawn or rendered.
// count = 0;
// count2 = 0;

// intArray = [];
// for(let i = 0; i < maxRange; i++) {
//     intArray.push(i);
// }

// for(let i = 0; i < 200; i++) {
//     let rand1 = getRandomInt(min, maxRange);
//     let rand2 = getRandomInt(min, maxRange);
//     let temp1 = intArray[rand1];
//     intArray[rand1] = intArray[rand2];
//     intArray[rand2] = temp1;
// }

// previousMerge = [];
// endOfArray = false;
// finished = false;

// function render() {
//     count += 1;
    
//         // These variables are dealing with the delta time between frames.
//     let currentFrame = Date.now();
//     deltaTime += currentFrame - lastFrame;
//     lastFrame = currentFrame;
//     //console.log(currentFrame + " " + deltaTime + " " + lastFrame);

//         // This loop deals with game logic.
//     if(deltaTime >= gameLogicSpeed && !pauseGame) {
//         deltaTime = 0;

//         sort();

//         if(finished) {
//             console.log(Date.now() - startTime);
//             pauseGame = true;
//         }

//         count2 +=1;
//     }


    
    
//         // Call the draw function.
//             // This is used if the window is resized.
//     draw();

//         // Select a color and fill the whole screen with it.
//     ctx.fillStyle = "gray";
//     ctx.fillRect(0, 0, canv.width, canv.height);

//         // Select another color.
//     ctx.fillStyle = "black";
//     for(let i = 0; i < 100; i++) {
//         ctx.fillRect(i * barWidth, canv.height, barWidth, -(intArray[i] * barHeight));
//     }
//         // Loop the same function we are in.
//     window.requestAnimationFrame(render);
// }

// Do an array of indexes of beginning of each group.
// pop the latest index to compare to it.
function sort4() {
    // console.log("Hello");
    if(count2 == 0) {
        // console.log("hello2.0");
        if(intArray[1] < intArray[0]) {
            let temp1 = intArray[0];
            intArray[0] = intArray[1];
            intArray[1] = temp1;
        }
        previousMerge.push([0,1]);
        count2 += 1;
        return 0;
    } else {
        if(previousMerge.length > 1) {
            // console.log("1: ", previousMerge.length);
            let i = previousMerge.length -1;
            if(((previousMerge[i-1][1] - previousMerge[i-1][0] + 1) == (previousMerge[i][1] - previousMerge[i][0] + 1)) || endOfArray) {
                // console.log("hello");
                let mergedArray = [previousMerge[i-1][0], previousMerge[i][1]];
                let tempArray = [];
                tempArray.push(new Array());
                tempArray.push(new Array());
                let count3 = [0, 0];
                for(let j = previousMerge[i-1][0]; j <= previousMerge[i-1][1]; j++) {
                    tempArray[0].push(intArray[j]);
                }
                for(let j = previousMerge[i][0]; j <= previousMerge[i][1]; j++) {
                    tempArray[1].push(intArray[j]);
                }
                let deltaIndex = previousMerge[i-1][0];
                // console.log(tempArray[0]);
                // console.log(tempArray[1]);
                // console.log(intArray);
                for(let j = previousMerge[i-1][0]; j <= previousMerge[i][1]; j++) {
                    if(count3[0] == tempArray[0].length) {
                        intArray[j] = tempArray[1][count3[1]];
                        count3[1] += 1;
                    } else if(count3[1] == tempArray[1].length) {
                        intArray[j] = tempArray[0][count3[0]];
                        count3[0] += 1;
                    } else if(tempArray[1][count3[1]] < tempArray[0][count3[0]]) {
                        intArray[j] = tempArray[1][count3[1]];
                        count3[1] += 1;
                    } else {
                        intArray[j] = tempArray[0][count3[0]];
                        count3[0] += 1;
                    }
                    // console.log(intArray);
                }
                previousMerge.pop();
                previousMerge.pop();
                previousMerge.push(mergedArray);
                // console.log("2: ", previousMerge.length);

                count2 += 1;
                return 0;
            }
        }

        // console.log(previousMerge);
        // console.log(previousMerge.length-1);
        if(!endOfArray) {
            indexStart = previousMerge[previousMerge.length-1][1]+1;
            if(indexStart == intArray.length-1) {
                previousMerge.push([indexStart, indexStart]);
                endOfArray = true;
                count2 += 1;
                return 0;
            } else if(indexStart == intArray.length-2) {
                endOfArray = true;
            }
            if(intArray[indexStart+1] < intArray[indexStart]) {
                let temp1 = intArray[indexStart];
                intArray[indexStart] = intArray[indexStart+1];
                intArray[indexStart+1] = temp1;
            }
            previousMerge.push([indexStart,indexStart+1]);
        } else {
            finished = true;
        }
    }

    // count2 += 1;
}


// function getRandomIntInclusive(min, max) {
//       min = Math.ceil(min);
//         max = Math.floor(max);
//           return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
// }

// function getRandomInt(min, max) {
//       min = Math.ceil(min);
//         max = Math.floor(max);
//           return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive 
// }

//     // An event listener for keyboard presses.
// function keyPush(evt) {
//     switch (evt.keyCode) {
//         case 37:
//             break;
//         case 38:
//             break;
//         case 39:
//             break;
//         case 40:
//             break;
//         case 32:
//             pauseGame = !pauseGame;
//             break;
//     }
// }


//     // The draw function that deals with window resizing.
// function draw() {
//     canv.width  = window.innerWidth;
//     canv.height = window.innerHeight;

//     barWidth = canv.width / maxRange;
//     barHeight = canv.height / maxRange;
// }
