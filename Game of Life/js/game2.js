window.onload = function() {
    //canv = document.getElementById("mainCanvas");
    //canv.width = window.innerWidth;
    //canv.height = window.innerHeight;
    ctx = canv.getContext("2d");

    //var sandboxWidth = canv.width / cellSize;
    //var sandboxHeight = canv.height / cellSize;
    
    document.addEventListener("keydown", keyPush);
    document.addEventListener("wheel", mouseWheel, false);
    document.addEventListener("mousedown", mouseDown, false);
    document.addEventListener("mouseup", mouseUp, false);
    document.addEventListener("mousemove", mouseDrag);
    document.addEventListener("click", mouseClick, false);
    //testing2(testArray1);
    //testing2(testArray2[2]);
    //testing(testArray1);
    //testing(testArray2[2]);
    //console.log(testArray1);
    //console.log(testArray2);
        // Creating a web socket.
        // The gameSocket.readyState = CONNECTING at first and becomes
            // OPEN once the connection is ready.
    gameSocket = new WebSocket('ws://192.168.1.16:8000');
        // Closing the gameSocket connection.
            // It may be a good idea to check the gameSocket.bufferedAmount attribute before closing the connection.
                // IDEA: When wanting to close the connection set boolean 'closing' to true.
                // When data is requested to be sent it will check the closing boolean and send if false.
                // Once all remaining data has been sent and received the gameSocket will close.
    //gameSocket.close();
    game();
};

//testArray1 = [[22, 32], [44, 64], [88, 128], [176, 256]];
//testArray2 = [[[256, 176], [128, 88], [64, 44], [32, 22]], [[1, 2], [2, 4], [4, 8], [8, 12]], [[432, 123], [76, 34], [76, 21], [87, 98]]];

canv = document.getElementById("mainCanvas");

    // Setting the width and length of the canvas 
        // to the width and length of the monitor to perfectly fit the screen.
canv.width = window.innerWidth;
canv.height = window.innerHeight;

    // The dimensions of the sandbox in cells.
sandboxWidth = 400;
sandboxHeight = 400;

    // The pixel the top left corner (origin) is on.
gameViewOriginX = 0;
gameViewOriginY = 0;

    // The cell the top left corner (origin) is on.
gameViewOriginCellX = 0;
gameViewOriginCellY = 0;

    // The dimensions of the game view in cells.
        // The number of cells increase when zooming out and decrease when zooming in.
gameViewCellWidth = 0;
gameViewCellHeight = 0;

    // The length and width of a cell in pixels.
cellSize = 10;
    // The length or width of the border of a cell in pixels.
cellBorder = .2;

    // tempy is being used to learn about web sockets.
tempy = 3
isItColor = false;

    // The deltaTime and lastFrame variables are being used to interval the game logic.
        // This is necessary to separate game logic from game rendering.
            // This creates a smooth experience of navigating the sandbox.
            // The game rendering and game logic used to be interlocked resulting in the navigation of the
                // sandbox to be locked to the speed of the game logic. This can be painful when game logic
                    // is slowed down for testing or placing cells.
deltaTime = 0;
lastFrame = 0;

playerNumber = 0;
playerCount = 0;
    // Going to be used to receive a color from the server.
myColor = "";
    // Same thing as myColor except for opponents colors.
//opponentsColors = new Array(6);
opponentsColors = ["lime", "red", "yellow", "blue", "purple", "orange"];

    // This boolean is used when pausing the game logic to place cells.
pauseGame = false;
    // This boolean is used to deal with mouse drags when wanting to navigate the sandbox.
isDragging = false;
    // This boolean helps to differentiate between a mouse drag or mouse click.
isMouseDown = false;

    // These variables are used to determine what block was clicked on to fill it with a cell.
cursorCoordX = 0;
cursorCoordY = 0;
    // These variables are used to determine how much the mouse has been dragged from its original spot.
        // They are used for navigating the sandbox.
dragDeltaX = 0;
dragDeltaY = 0;

    // The interval speed for game logic.
    // The variable uses milliseconds to determine game logic 
        // (100 = 100 milliseconds until the next call to game logic).
gameLogicSpeed = 100;

    // How many times the game has been drawn or rendered.
count = 0;
count2 = 0;

    // The location of all cells for the current player.
cellsLocation = [];
    // The location of all clicked blocks in the current game logic loop to fill them with cells.
clickedCellsLocation = [];
    // The location of all cells for each opponent.
opponentsCellsLocation = [];
for(var i = 0; i < 6; i++) {
    opponentsCellsLocation.push(new Array());
}
    // An array of all blocks in the sandbox (400*400).
blockStatus = [];
for(var i = 0; i < sandboxWidth; i++) {
    blockStatus.push(new Array(sandboxHeight));
    for(var j = 0; j < sandboxHeight; j++) {
        blockStatus[i][j] = 0;
    }
}
    // An array of all blocks in the sanbox (400*400)
        // A second array for all blocks is necessary for 
            // game logic to separate old cells from new ones when counting surrounding cells.
nextBlockStatus = [];
for(var i = 0; i < sandboxWidth; i++) {
    nextBlockStatus.push(new Array(sandboxHeight));
    for(var j = 0; j < sandboxHeight; j++) {
        nextBlockStatus[i][j] = 0;
    }
}

    // The main function that deals with both game rendering and game logic.
function game() {
    count += 1;
    
        // These variables are dealing with the delta time between frames.
    let currentFrame = Date.now();
    deltaTime += currentFrame - lastFrame;
    lastFrame = currentFrame;
    //console.log(currentFrame + " " + deltaTime + " " + lastFrame);

        // This loop deals with game logic.
    if(deltaTime >= gameLogicSpeed && !pauseGame) {
        count2 +=1;
            // This loop is adding the clickedCellsLocation array to the main cellsLocation array.
        for(var i = 0; i < clickedCellsLocation.length; i++) {
            cellsLocation.push(clickedCellsLocation[i]);
            //console.log(clickedCellsLocation.length);
        }

        //console.log(clickedCellsLocation);
        
            // This loop is checking if the web socket connection is still connected.
                // gameSocket.readyState can either be 0, 1, 2, or 3.
                // 0: Connecting; 1: Connected, Open; 2: Closing; 3: Closed.
        if(gameSocket.readyState == 1) {
                // Call a function to send data to the server.
            sendData();
            //gameSocket.onopen = sendData;
        }
        //console.log(gameSocket.readyState);
        
            // Emptying the array to be ready for the next loop of game logic.
        clickedCellsLocation.length = 0;
            // Will receive data from the server if there is something to be received.
        gameSocket.onmessage = receiveData;
            // Finally reset the deltaTime.
        deltaTime = 0;

            // Last, deal with game logic.
        //cpyNextToCurrBlockStatusArray();
        clearBlockStatusArray();
        //console.log(cellsLocation);
        cpyCellToBlockStatusArray(cellsLocation, playerNumber+1);
        //console.log(cellsLocation);
        for(var i = 0; i < 6; i++) {
            if(opponentsCellsLocation[i] && i != playerNumber) {
                cpyCellToBlockStatusArray(opponentsCellsLocation[i], i+1);
            }
        }
        //console.log(cellsLocation);
        setNextBlockStatus(cellsLocation, playerNumber+1);
        //console.log(cellsLocation);
        for(var i = 0; i < 6; i++) {
            if(opponentsCellsLocation[i] && i != playerNumber) {
                setNextBlockStatus(opponentsCellsLocation[i], i+1);
            }
        }
        //console.log(cellsLocation);
    }


    
        // Preset cells to use for testing.
    if(count == 1) {
        cellsLocation.push([20, 20]);
        cellsLocation.push([21, 20]);
        cellsLocation.push([22, 20]);
        cellsLocation.push([22, 19]);
        cellsLocation.push([21, 18]);

        cellsLocation.push([20, 0]);
        cellsLocation.push([21, 0]);
        cellsLocation.push([20, 1]);
        cellsLocation.push([21, 1]);

        cellsLocation.push([0, 20]);
        cellsLocation.push([0, 21]);
        cellsLocation.push([1, 20]);
        cellsLocation.push([1, 21]);

        cellsLocation.push([390, 390]);
        cellsLocation.push([391, 390]);
        cellsLocation.push([392, 390]);
        cellsLocation.push([392, 389]);
        cellsLocation.push([391, 388]);

        cellsLocation.push([10, 390]);
        cellsLocation.push([11, 390]);
        cellsLocation.push([12, 390]);
        cellsLocation.push([10, 389]);
        cellsLocation.push([11, 388]);

        cellsLocation.push([390, 10]);
        cellsLocation.push([391, 10]);
        cellsLocation.push([392, 10]);
        cellsLocation.push([392, 11]);
        cellsLocation.push([391, 12]);

        cellsLocation.push([10, 10]);
        cellsLocation.push([11, 10]);
        cellsLocation.push([12, 10]);
        cellsLocation.push([10, 11]);
        cellsLocation.push([11, 12]);
    }
    //console.log(cellsLocation + " " + count2);
    //console.log(cellsLocation);
    
        // Call the draw function.
            // This is used if the window is resized.
    draw();

        // Select a color and fill the whole screen with it.
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canv.width, canv.height);

        // Select another color.
    ctx.fillStyle = "black";
    //console.log(gameViewOriginX + " " + gameViewOriginY);
    //console.log(gameViewOriginCellX + ", " + gameViewOriginCellY);
        
        // Draw the horizontal border lines.
    for(var i = gameViewOriginCellX; i < gameViewOriginCellX + gameViewCellWidth + 2; i++) {
        ctx.fillRect((i * cellSize) - gameViewOriginX, 0, cellBorder, cellSize * (gameViewCellHeight + 1));
    }
        // Draw the vertical border lines.
    for(var j = gameViewOriginCellY; j < gameViewOriginCellY + gameViewCellHeight + 2; j++) {
        ctx.fillRect(0, (j * cellSize) - gameViewOriginY, cellSize * (gameViewCellWidth + 1), cellBorder);
    }


    //if(gameViewOriginCellX == 0 || 
    //        gameViewOriginCellY = 0 || 
    //        gameViewOriginX + gameViewCellWidth == sandboxWidth || 
    //        gameViewOriginY + gameViewCellHeight == sandboxHeight) {
    //    ctx.fillStyle = "red";
    //    
    //}

    //console.log(myColor);

        // Select a color for the cell color
    ctx.fillStyle = myColor || "lime";
        // Draw all cells onto the sandbox.
    for(var i = 0; i < cellsLocation.length; i++) {
        ctx.fillRect((cellsLocation[i][0] * cellSize + cellBorder) - gameViewOriginX, (cellsLocation[i][1] * cellSize + cellBorder) - gameViewOriginY, cellSize - cellBorder, cellSize - cellBorder);
    }

        // Select a color for the clicked cells.
    ctx.fillStyle = "green";
        // Draw all clicked cells onto the sandbox.
    for(var i = 0; i < clickedCellsLocation.length; i++) {
        ctx.fillRect((clickedCellsLocation[i][0] * cellSize + cellBorder) - gameViewOriginX, (clickedCellsLocation[i][1] * cellSize + cellBorder) - gameViewOriginY, cellSize - cellBorder, cellSize - cellBorder);
    }

    //for(var i = 0; i < opponentsCellsLocation.count; i++) {
    //    ctx.fillStyle = opponentsCellsLocation.cellLocation[i].color;
    //    for(var j = 0; j < opponentsCellsLocation.cellLocation[i].cells
    //}

        for(var i = 0; i < opponentsCellsLocation.length; i++) {
            if(opponentsCellsLocation[i] && i != playerNumber) {
                ctx.fillStyle = opponentsColors[i];
                for(var j = 0; j < opponentsCellsLocation[i].length; j++) {
                    ctx.fillRect((opponentsCellsLocation[i][j][0] * cellSize + cellBorder) - gameViewOriginX, (opponentsCellsLocation[i][j][1] * cellSize + cellBorder) - gameViewOriginY, cellSize - cellBorder, cellSize - cellBorder);
                }
            }
        }
    //}

        // Loop the same function we are in.
    window.requestAnimationFrame(game);
}

    // Game logic for all cells.
function setNextBlockStatus(cellsLocations, playerID) {
    //console.log(cellsLocations);
    let arrayLength = cellsLocations.length;
    //console.log(arrayLength);

        // Loop will count all cells' surrounding cells and check empty blocks nearby.
    for (var i = 0; i < arrayLength; i++) {
        let surrCellCount = 0;
        let oppSurrCellCount = 0;
        let surrResult = 0;

        let xLessOne = cellsLocations[i][0] - 1;
        let xPlusOne = cellsLocations[i][0] + 1;
        let yLessOne = cellsLocations[i][1] - 1;
        let yPlusOne = cellsLocations[i][1] + 1;
        let topL = [xLessOne, yLessOne];
        let topt = [cellsLocations[i][0], yLessOne];
        let topR = [xPlusOne, yLessOne];
        let left = [xLessOne, cellsLocations[i][1]];
        let right = [xPlusOne, cellsLocations[i][1]];
        let botL = [xLessOne, yPlusOne];
        let bot = [cellsLocations[i][0], yPlusOne];
        let botR = [xPlusOne, yPlusOne];


        if(topL[0] >= 0 && topL[1] >= 0) {
            surrResult = checkSurrBlock(topL[0], topL[1], cellsLocations, playerID);
            if(surrResult < 2) {
                surrCellCount += surrResult;
            } else {
                oppSurrCellCount += 1;
            }
        }

        if(topt[1] >= 0) {
            surrResult = checkSurrBlock(topt[0], topt[1], cellsLocations, playerID);
            if(surrResult < 2) {
                surrCellCount += surrResult;
            } else {
                oppSurrCellCount += 1;
            }
        }

        if(topR[0] < sandboxWidth && topR[1] >= 0) {
            surrResult = checkSurrBlock(topR[0], topR[1], cellsLocations, playerID);
            if(surrResult < 2) {
                surrCellCount += surrResult;
            } else {
                oppSurrCellCount += 1;
            }
        }

        if(left[0] >= 0) {
            surrResult = checkSurrBlock(left[0], left[1], cellsLocations, playerID);
            if(surrResult < 2) {
                surrCellCount += surrResult;
            } else {
                oppSurrCellCount += 1;
            }
        }

        if(right[0] < sandboxWidth) {
            surrResult = checkSurrBlock(right[0], right[1], cellsLocations, playerID);
            if(surrResult < 2) {
                surrCellCount += surrResult;
            } else {
                oppSurrCellCount += 1;
            }
        }

        if(botL[0] >= 0 && botL[1] < sandboxHeight) {
            surrResult = checkSurrBlock(botL[0], botL[1], cellsLocations, playerID);
            if(surrResult < 2) {
                surrCellCount += surrResult;
            } else {
                oppSurrCellCount += 1;
            }
        }

        if(bot[1] < sandboxHeight) {
            surrResult = checkSurrBlock(bot[0], bot[1], cellsLocations, playerID);
            if(surrResult < 2) {
                surrCellCount += surrResult;
            } else {
                oppSurrCellCount += 1;
            }
        }

        if(botR[0] < sandboxWidth && botR[1] < sandboxHeight) {
            surrResult = checkSurrBlock(botR[0], botR[1], cellsLocations, playerID);
            if(surrResult < 2) {
                surrCellCount += surrResult;
            } else {
                oppSurrCellCount += 1;
            }
        }




        if(surrCellCount == 0 || surrCellCount == 1 || surrCellCount + oppSurrCellCount > 3) {
            //blockStatus[cellsLocations[i][0]][cellsLocations[i][1]] = 0;
            cellsLocations.splice(i, 1);
            arrayLength -= 1;
            i -= 1;
        }
    }
}

    // Function will check if the block has a cell and return a 1 or 0 based on that info.
function checkSurrBlock(xa, ya, cellsLocations, playerID) {
    if(blockStatus[xa][ya] == 0) {
        if(nextBlockStatus[xa][ya] == 0) {
            checkEmptyCellStatus(xa, ya, cellsLocations, playerID);
        }
        return 0;
    } else if(blockStatus[xa][ya] == playerID) {
       return 1;
    } else {
        return 2;
    }
}

    // Function will check if an empty block near a cell deserves to become a cell.
function checkEmptyCellStatus(xa, ya, cellsLocations, playerID) {

    let topL = [xa-1, ya-1];
    let topt = [xa, ya-1];
    let topR = [xa+1, ya-1];
    let left = [xa-1, ya];
    let right = [xa+1, ya];
    let botL = [xa-1, ya+1];
    let bot = [xa, ya+1];
    let botR = [xa+1, ya+1];

    let surrCellCount2 = 0;
    

    if(topL[0] >= 0 && topL[1] >= 0) {
        if(blockStatus[topL[0]][topL[1]] == playerID) {
            surrCellCount2 +=1
        }
    }

    if(topt[1] >= 0) {
        if(blockStatus[topt[0]][topt[1]] == playerID) {
            surrCellCount2 +=1
        }
    }

    if(topR[0] < sandboxWidth && topR[1] >= 0) {
        if(blockStatus[topR[0]][topR[1]] == playerID) {
            surrCellCount2 +=1
        }
    }

    if(left[0] >= 0) {
        if(blockStatus[left[0]][left[1]] == playerID) {
            surrCellCount2 +=1
        }
    }

    if(right[0] < sandboxWidth) {
        if(blockStatus[right[0]][right[1]] == playerID) {
            surrCellCount2 +=1
        }
    }

    if(botL[0] >= 0 && botL[1] < sandboxHeight) {
        if(blockStatus[botL[0]][botL[1]] == playerID) {
            surrCellCount2 +=1
        }
    }

    if(bot[1] < sandboxHeight) {
        if(blockStatus[bot[0]][bot[1]] == playerID) {
            surrCellCount2 +=1
        }
    }

    if(botR[0] < sandboxWidth && botR[1] < sandboxHeight) {
        if(blockStatus[botR[0]][botR[1]] == playerID) {
            surrCellCount2 +=1
        }
    }


    if(surrCellCount2 == 3) {
        cellsLocations.push([xa, ya]);
        nextBlockStatus[xa][ya] = playerID;
    }
}

    // Function will clear both block status arrays.
function clearBlockStatusArray() {
    for (var i = 0; i < sandboxHeight; i++) {
        for(var j = 0; j < sandboxHeight; j++) {
            blockStatus[i][j] = 0;
            nextBlockStatus[i][j] = 0;
        }
    }
}

    // Function will copy info from nextBlockStatus to blockStatus array.
function cpyNextToCurrBlockStatusArray() {
    for (var i = 0; i < sandboxWidth; i++) {
        for(var j = 0; j < sandboxHeight; j++) {
            blockStatus[i][j] = nextBlockStatus[i][j];
        }
    }
}

    // Function will place all cells into blockStatus array.
function cpyCellToBlockStatusArray(cellsLocations, playerID) {
    let arrayLength = cellsLocations.length;
    for (var i = 0; i < arrayLength; i++) {
        //console.log(i + " " + cellsLocation);
        blockStatus[cellsLocations[i][0]][cellsLocations[i][1]] = playerID;
    }
}

    // An event listener for keyboard presses.
function keyPush(evt) {
    switch (evt.keyCode) {
        case 37:
            console.log("gameViewOrigin: " + gameViewOriginX + ", " + gameViewOriginY);
            break;
        case 38:
            console.log("gameViewOriginCell: " + gameViewOriginCellX + ", " + gameViewOriginCellY);
            break;
        case 39:
            console.log("Cell Size: " + cellSize);
            break;
        case 40:
            console.log("gameViewCell: " + gameViewCellWidth + ", " + gameViewCellHeight);
            break;
        case 32:
            pauseGame = pauseGame ? false : true;
            //if(gameSpeed == 1000) {
            //    gameSpeed = 4000;
            //} else if(gameSpeed == 4000) {
            //    gameSpeed = 9000;
            //} else if(gameSpeed == 9000) {
            //    gameSpeed = 30000;
            //} else {
            //    gameSpeed = 1000;
            //}
            break;
    }
}

    // An event listener for the mouse wheel.
        // Used for zooming.
function mouseWheel(e) {
    //console.log(e.deltaY);
    deltaY = e.deltaY / 2;
    //console.log(canv.width + ", " + canv.height);
    //console.log((cellSize - deltaY) * sandboxWidth);
    if(cellSize - deltaY > 0 && 
            cellBorder - deltaY / (cellSize / cellBorder) > 0 && 
            (cellSize - deltaY) * sandboxWidth >= canv.width && 
            (cellSize - deltaY) * sandboxHeight >= canv.height) {
        setGameViewOrigin(deltaY);
        cellSizeTemp = cellSize
        cellSize -= deltaY;
        cellBorder -= deltaY / (cellSizeTemp / cellBorder );
        //setGameViewOrigin(deltaY);

        setGameViewOriginCell();
        setGameViewCell();
    }
    //console.log(cellSize);
    //console.log(cellBorder);
    //console.log(cellSize / cellBorder);
}

    // Readjust the game view origin point whenever a zoom happens.
function setGameViewOrigin(zoomAdjust) {
    temp1 = gameViewOriginX / cellSize;
    temp2 = gameViewOriginY / cellSize;
    dragDeltaX = temp1 * zoomAdjust;
    dragDeltaY = temp2 * zoomAdjust;
        // TODO: zoomAdjust needs to be looked at. Also, the && needs to be looked at.
    if(gameViewOriginX - dragDeltaX >= (sandboxWidth * (cellSize - zoomAdjust)) - canv.width) {
        gameViewOriginX = (sandboxWidth * (cellSize - zoomAdjust)) - canv.width;
    }
    else if(gameViewOriginX - dragDeltaX > 0) { //&& gameViewOriginX - dragDeltaX < (sandboxWidth * (cellSize - zoomAdjust)) - canv.width) {
    //if(gameViewOriginX - dragDeltaX > 0 && gameViewOriginX - dragDeltaX < (sandboxWidth * cellSize) - canv.width) {
        gameViewOriginX -= dragDeltaX;
    }
    //else if(gameViewOriginX - dragDeltaX > (sandboxWidth * (cellSize - zoomAdjust)) - canv.width) {
    //    gameViewOriginX = (sandboxWidth * (cellSize - zoomAdjust)) - canv.width;
    //}
        // TODO: zoomAdjust needs to be looked at. Also, the && needs to be looked at.
    if(gameViewOriginY - dragDeltaY >= (sandboxHeight * (cellSize - zoomAdjust)) - canv.height) {
        gameViewOriginY = (sandboxHeight * (cellSize - zoomAdjust)) - canv.height;
    }
    else if(gameViewOriginY - dragDeltaY > 0) { //&& gameViewOriginY - dragDeltaY < (sandboxHeight * (cellSize - zoomAdjust)) - canv.height) {
    //if(gameViewOriginY - dragDeltaY > 0 && gameViewOriginY - dragDeltaY < (sandboxHeight * cellSize) - canv.height) {
        gameViewOriginY -= dragDeltaY;
    } 
    //else if(gameViewOriginY - dragDeltaY > (sandboxHeight * (cellSize - zoomAdjust)) - canv.height) {
    //    gameViewOriginY = (sandboxHeight * (cellSize - zoomAdjust)) - canv.height;
    //}


    //console.log(gameViewOriginX + ", " + gameViewOriginY);
    //console.log(dragDeltaX);
    //console.log((sandboxWidth * (cellSize - zoomAdjust)) - canv.width)
    //console.log((sandboxHeight * (cellSize - zoomAdjust)) - canv.height)
    //console.log(canv.width + " " + canv.height);
}

    // Readjust the game view origin cell whenever a zoom or drag happens.
function setGameViewOriginCell() {
    //console.log(gameViewOriginX / 10 + ", " + gameViewOriginY / 10);
    if(gameViewOriginCellX != gameViewOriginX / cellSize || gameViewOriginCellY != gameViewOriginY / cellSize) {
        //console.log("hello");
        gameViewOriginCellX = Math.floor(gameViewOriginX / cellSize);
        gameViewOriginCellY = Math.floor(gameViewOriginY / cellSize);
    }
    //console.log(gameViewOriginCellX + " " + gameViewOriginY);
}

    // Readjust the game view cell dimensions whenever a zoom happens.
function setGameViewCell() {
    gameViewCellWidth = Math.floor(canv.width / cellSize);
    gameViewCellHeight = Math.floor(canv.height / cellSize);
}

    // Event listener for mouse clicks.
function mouseDown(e) {
    didDrag = false;
    cursorCoordX = e.clientX;
    cursorCoordY = e.clientY;
    isDragTimer = setTimeout(isDrag, 150);
}

    // Function that is waiting for a timeout to expire.
        // If the time limit is reached then the mouse click is determined to be a drag.
function isDrag() {
    isDragging = true;
}

    // Event listener for release of a mouse click.
function mouseUp(e) {
    //isMouseDown = false;
    clearTimeout(isDragTimer);
    isDragging = false;
}

    // Event listener that is always being triggered while the mouse moves, 
        // but will only trigger code once the isDrag function is called.
function mouseDrag(e) {
    //if(isMouseDown == true) {
    if(isDragging == true) {
        didDrag = true;
        let cursorMoveX = e.clientX;
        let cursorMoveY = e.clientY;
        dragDeltaX = cursorCoordX - cursorMoveX ;
        dragDeltaY = cursorCoordY - cursorMoveY ;
        cursorCoordX = cursorMoveX;
        cursorCoordY = cursorMoveY;
        //console.log(dragDeltaX + ", " + dragDeltaY);

        if(gameViewOriginX + dragDeltaX > 0 && gameViewOriginX + dragDeltaX < (sandboxWidth * cellSize) - canv.width) {
            gameViewOriginX += dragDeltaX;
        }
        if(gameViewOriginY + dragDeltaY > 0 && gameViewOriginY + dragDeltaY < (sandboxHeight * cellSize) - canv.height) {
            gameViewOriginY += dragDeltaY;
        }

        setGameViewOriginCell();
        
        //console.log(gameViewOriginX + ", " + gameViewOriginY);
    }
}

    // Event listener that is called once the mouse is clicked and released.
        // Will not trigger code if isDrag is called.
function mouseClick(e) {
    if(!didDrag) {
        var xPosition = e.clientX;
        var yPosition = e.clientY;
        //console.log(xPosition + " " + yPosition);
        var xCellPos = Math.floor((xPosition + gameViewOriginX) / cellSize);
        var yCellPos = Math.floor((yPosition + gameViewOriginY) / cellSize);
        
        if(blockStatus[xCellPos][yCellPos] == 1) {
            //blockStatus[xCellPos][yCellPos] = 0;
        } else {
            //blockStatus[xCellPos][yCellPos] = 1;
            //cellsLocation.push([xCellPos, yCellPos]);
            clickedCellsLocation.push([xCellPos, yCellPos]);
        }
    }
}

    // The draw function that deals with window resizing.
function draw() {
    //ctx = canv.getContext("2d");
    //ctx.canvas.width  = window.innerWidth;
    //ctx.canvas.height = window.innerHeight;
    canv.width  = window.innerWidth;
    canv.height = window.innerHeight;

    let temp1 = Math.floor(canv.width / cellSize);
    let temp2 = Math.floor(canv.height / cellSize);
    let temp3 = gameViewOriginCellX + temp1;
    let temp4 = gameViewOriginCellY + temp2;
    let temp5 = gameViewOriginX + canv.width;
    let temp6 = gameViewOriginY + canv.height;

    gameViewCellWidth = temp1;
    gameViewCellHeight = temp2;

    gameViewOriginX -= temp5 > sandboxWidth * cellSize ? temp5 - sandboxWidth * cellSize : 0;
    gameViewOriginY -= temp6 > sandboxHeight * cellSize ? temp6 - sandboxHeight * cellSize : 0;

    //console.log("BEFORE: " + gameViewOriginCellX + " " + gameViewOriginCellY);
    //console.log("TEMP: " + temp3 + " " + temp4);
    //console.log(gameViewCellWidth + ", " + gameViewCellHeight);
    gameViewOriginCellX -= ((temp3 > sandboxWidth) ? temp3 - sandboxWidth : 0);
    gameViewOriginCellY -= ((temp4 > sandboxHeight) ? temp4 - sandboxHeight : 0);
    //console.log("AFTER: " + gameViewOriginCellX + " " + gameViewOriginCellY);

    //ctx.fillStyle = "grey";
    //ctx.fillRect(0, 0, canv.width, canv.height);
}

    // Function that will send if there is any to be sent.
function sendData(event) {
    if(clickedCellsLocation.length > 0) {
        let dataBuffer = {};
        let minorDataBuffer = {};
        dataBuffer[0] = playerNumber;
        for(var i = 0; i < clickedCellsLocation.length; i++) {
            minorDataBuffer[i] = {};
            minorDataBuffer[i][0] = clickedCellsLocation[i][0];
            minorDataBuffer[i][1] = clickedCellsLocation[i][1];
        }
        dataBuffer[1] = minorDataBuffer;
        gameSocket.send(JSON.stringify(dataBuffer));
    }
}


    // Function that will received data if there is any to be received.
function receiveData(event) {
        // Receiving a message from the server.
            // Text received from a WebSocket connection is in UTF-8 format.
    //console.log(event.data);
    data = event.data;
    data = JSON.parse(data);
    if(data.color) {
        myColor = data.color;
        playerNumber = data.playerID;
        //console.log(playerNumber);
    } else {
        for(i in data) {
            for(j in data[i]) {
                opponentsCellsLocation[Number(i)].push([data[i][j][0], data[i][j][1]]);
                //console.log(i + j);
            }
        }
        console.log(opponentsCellsLocation);
    }
}

function testing(someArray) {
    console.log(someArray[0][1]);
    console.log(someArray[3][0]);
}

function testing2(someArray) {
    someArray[0][1] = 1;
    someArray[3][0] = 9;
}
