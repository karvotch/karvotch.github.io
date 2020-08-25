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
    // 1000 determines speed of snake.
    //setInterval(game, gameSpeed / 15);
        // Creating a web socket.
        // The gameSocket.readyState = CONNECTING at first and becomes
            // OPEN once the connection is ready.
    gameSocket = new WebSocket('ws://localhost:9999');
        // When the gameSocket connection is open it will call the sendData function.
            // This is an event handler.
    //gameSocket.onopen = sendData;
        // Another event handler that deals with incoming data.
    //gameSocket.onmessage = receiveData;
        // Closing the gameSocket connection.
            // It may be a good idea to check the gameSocket.bufferedAmount attribute before closing the connection.
                // IDEA: When wanting to close the connection set boolean 'closing' to true.
                // When data is requested to be sent it will check the closing boolean and send if false.
                // Once all remaining data has been sent and received the gameSocket will close.
    //gameSocket.close();
    game();
}


tempy = 3
deltaTime = 0;
lastFrame = 0;

pauseGame = false;
isDragging = false;
isMouseDown = false;
cursorCoordX = 0;
cursorCoordY = 0;
//cursorMoveX = 0;
//cursorMoveY = 0;
dragDeltaX = 0;
dragDeltaY = 0;

gameSpeed = 1000;
cellSize = 10;
cellBorder = .2;
canv = document.getElementById("mainCanvas");

canv.width = window.innerWidth;
canv.height = window.innerHeight;

sandboxWidth = 400;
sandboxHeight = 400;

//gameViewOriginX = ((sandboxWidth / 2) * cellSize) - (canv.width / 2);
//gameViewOriginY = ((sandboxHeight / 2) * cellSize) - (canv.height / 2);

gameViewOriginX = 0;
gameViewOriginY = 0;

gameViewOriginCellX = 0;
gameViewOriginCellY = 0;

gameViewCellWidth = 0;
gameViewCellHeight = 0;

//console.log(gameViewOriginX + ", " + gameViewOriginY);

//sandboxViewWidth = Math.floor((canv.width * 2) / cellSize);
//sandboxViewHeight = Math.floor((canv.height * 2) / cellSize);

//console.log(sandboxViewHeight + " " + sandboxViewWidth);

bg = st = 20;
count = 0;


cellsLocation = [];

blockStatus = [];
for(var i = 0; i < sandboxWidth; i++) {
    blockStatus.push(new Array(sandboxHeight));
    for(var j = 0; j < sandboxWidth; j++) {
        blockStatus[i][j] = false;
    }
}

nextBlockStatus = [];
for(var i = 0; i < sandboxWidth; i++) {
    nextBlockStatus.push(new Array(sandboxHeight));
    for(var j = 0; j < sandboxWidth; j++) {
        nextBlockStatus[i][j] = false;
    }
}

function game() {
    count += 1;
    

    let currentFrame = Date.now();
    deltaTime += currentFrame - lastFrame;
    lastFrame = currentFrame;
    //console.log(currentFrame + " " + deltaTime + " " + lastFrame);
    if(deltaTime >= 500) {
        if(gameSocket.readyState == 1) {
            sendData();
            //gameSocket.onopen = sendData;
            //console.log("i need to know");
        }
        //console.log("okay");
        console.log(gameSocket.readyState);
        gameSocket.onmessage = receiveData;
        deltaTime = 0;
        if(!pauseGame) {
            //cpyNextToCurrBlockStatusArray();
            clearBlockStatusArray();
            cpyCellToBlockStatusArray();
            setNextBlockStatus();
        }
    }


    

    if(count == 1) {
        cellsLocation.push([bg, st]);
        cellsLocation.push([21, st]);
        cellsLocation.push([22, st]);
        cellsLocation.push([22, 19]);
        cellsLocation.push([21, 18]);

        cellsLocation.push([st, 0]);
        cellsLocation.push([21, 0]);
        cellsLocation.push([st, 1]);
        cellsLocation.push([21, 1]);

        cellsLocation.push([0, st]);
        cellsLocation.push([0, 21]);
        cellsLocation.push([1, st]);
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
    
    draw();

    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canv.width, canv.height);


    ctx.fillStyle = "black";

    //console.log(gameViewOriginX + " " + gameViewOriginY);
    //console.log(gameViewOriginCellX + ", " + gameViewOriginCellY);
        // TODO: There might be problems with this.
    //for (var i = gameViewOriginCellX; i < gameViewOriginCellX + gameViewCellWidth + 2; i++) {
    //    for(var j = gameViewOriginCellY; j < gameViewOriginCellY + gameViewCellWidth + 2; j++) {
    //        ctx.fillRect((i * cellSize) - gameViewOriginX, (j * cellSize) - gameViewOriginY, cellSize, cellBorder);
    //        ctx.fillRect((i * cellSize) - gameViewOriginX, (j * cellSize) - gameViewOriginY, cellBorder, cellSize);

    //        //ctx.fillRect((i+1) * cellSize, (j+1) * cellSize, cellBorder, -(cellSize));
    //        //ctx.fillRect((i+1) * cellSize, (j+1) * cellSize, -(cellSize), -cellBorder);
    //    }
    //}

    for (var i = gameViewOriginCellX; i < gameViewOriginCellX + gameViewCellWidth + 2; i++) {
        ctx.fillRect((i * cellSize) - gameViewOriginX, 0, cellBorder, cellSize * (gameViewCellHeight + 1));
    }

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

    ctx.fillStyle = "lime";
    for (var i = 0; i < cellsLocation.length; i++) {
        ctx.fillRect((cellsLocation[i][0] * cellSize + cellBorder) - gameViewOriginX, (cellsLocation[i][1] * cellSize + cellBorder) - gameViewOriginY, cellSize - cellBorder, cellSize - cellBorder);
    }

    //setTimeout(game, gameSpeed / 15);
    window.requestAnimationFrame(game);
}


function setNextBlockStatus() {
    let arrayLength = cellsLocation.length;
    //console.log(arrayLength);
    for (var i = 0; i < arrayLength; i++) {
        surrCellCount = 0;


        let xLessOne = cellsLocation[i][0] - 1;
        let xPlusOne = cellsLocation[i][0] + 1;
        let yLessOne = cellsLocation[i][1] - 1;
        let yPlusOne = cellsLocation[i][1] + 1;
        let topL = [xLessOne, yLessOne];
        let topt = [cellsLocation[i][0], yLessOne];
        let topR = [xPlusOne, yLessOne];
        let left = [xLessOne, cellsLocation[i][1]];
        let right = [xPlusOne, cellsLocation[i][1]];
        let botL = [xLessOne, yPlusOne];
        let bot = [cellsLocation[i][0], yPlusOne];
        let botR = [xPlusOne, yPlusOne];


        if(topL[0] >= 0 && topL[1] >= 0) {
            surrCellCount += checkSurrBlock(topL[0], topL[1]);
        }

        if(topt[1] >= 0) {
            surrCellCount += checkSurrBlock(topt[0], topt[1]);
        }

        if(topR[0] < sandboxWidth && topR[1] >= 0) {
            surrCellCount += checkSurrBlock(topR[0], topR[1]);
        }

        if(left[0] >= 0) {
            surrCellCount += checkSurrBlock(left[0], left[1]);
        }

        if(right[0] < sandboxWidth) {
            surrCellCount += checkSurrBlock(right[0], right[1]);
        }

        if(botL[0] >= 0 && botL[1] < sandboxHeight) {
            surrCellCount += checkSurrBlock(botL[0], botL[1]);
        }

        if(bot[1] < sandboxHeight) {
            surrCellCount += checkSurrBlock(bot[0], bot[1]);
        }

        if(botR[0] < sandboxWidth && botR[1] < sandboxHeight) {
            surrCellCount += checkSurrBlock(botR[0], botR[1]);
        }




        if(surrCellCount == 0 || surrCellCount == 1 || surrCellCount >= 4) {
            //blockStatus[cellsLocation[i][0]][cellsLocation[i][1]] = false;
            cellsLocation.splice(i, 1);
            arrayLength -= 1;
            i -= 1;
        }
    }
}

function checkSurrBlock(xa, ya) {
    if(blockStatus[xa][ya] == false) {
        if(nextBlockStatus[xa][ya] == false) {
            checkEmptyCellStatus(xa, ya);
        }
        return 0;
   } else {
       return 1;
   }
}


function checkEmptyCellStatus(xa, ya) {

    let topL = [xa-1, ya-1];
    let topt = [xa, ya-1];
    let topR = [xa+1, ya-1];
    let left = [xa-1, ya];
    let right = [xa+1, ya];
    let botL = [xa-1, ya+1];
    let bot = [xa, ya+1];
    let botR = [xa+1, ya+1];

    surrCellCount2 = 0;
    

    if(topL[0] >= 0 && topL[1] >= 0) {
        if(blockStatus[topL[0]][topL[1]] == true) {
            surrCellCount2 +=1
        }
    }

    if(topt[1] >= 0) {
        if(blockStatus[topt[0]][topt[1]] ==true) {
            surrCellCount2 +=1
        }
    }

    if(topR[0] < sandboxWidth && topR[1] >= 0) {
        if(blockStatus[topR[0]][topR[1]] ==true) {
            surrCellCount2 +=1
        }
    }

    if(left[0] >= 0) {
        if(blockStatus[left[0]][left[1]] ==true) {
            surrCellCount2 +=1
        }
    }

    if(right[0] < sandboxWidth) {
        if(blockStatus[right[0]][right[1]] ==true) {
            surrCellCount2 +=1
        }
    }

    if(botL[0] >= 0 && botL[1] < sandboxHeight) {
        if(blockStatus[botL[0]][botL[1]] ==true) {
            surrCellCount2 +=1
        }
    }

    if(bot[1] < sandboxHeight) {
        if(blockStatus[bot[0]][bot[1]] ==true) {
            surrCellCount2 +=1
        }
    }

    if(botR[0] < sandboxWidth && botR[1] < sandboxHeight) {
        if(blockStatus[botR[0]][botR[1]] ==true) {
            surrCellCount2 +=1
        }
    }


    if(surrCellCount2 == 3) {
        cellsLocation.push([xa, ya]);
        nextBlockStatus[xa][ya] = true;
    }
}

function clearBlockStatusArray() {
    for (var i = 0; i < sandboxHeight; i++) {
        for(var j = 0; j < sandboxHeight; j++) {
            blockStatus[i][j] = false;
            nextBlockStatus[i][j] = false;
        }
    }
}

function cpyNextToCurrBlockStatusArray() {
    for (var i = 0; i < sandboxWidth; i++) {
        for(var j = 0; j < sandboxHeight; j++) {
            blockStatus[i][j] = nextBlockStatus[i][j];
        }
    }
}

function cpyCellToBlockStatusArray() {
    let arrayLength = cellsLocation.length;
    for (var i = 0; i < arrayLength; i++) {
        //console.log(i + " " + cellsLocation);
        blockStatus[cellsLocation[i][0]][cellsLocation[i][1]] = true;
    }
}

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

function mouseDown(e) {
    didDrag = false;
    cursorCoordX = e.clientX;
    cursorCoordY = e.clientY;
    isDragTimer = setTimeout(isDrag, 150);
}

function isDrag() {
    isDragging = true;
}

function mouseUp(e) {
    //isMouseDown = false;
    clearTimeout(isDragTimer);
    isDragging = false;
}

function mouseDrag(e) {
    //if(isMouseDown == true) {
    if(isDragging == true) {
        didDrag = true;
        cursorMoveX = e.clientX;
        cursorMoveY = e.clientY;
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

function mouseClick(e) {
    if(!didDrag) {
        var xPosition = e.clientX;
        var yPosition = e.clientY;
        //console.log(xPosition + " " + yPosition);
        var xCellPos = Math.floor((xPosition + gameViewOriginX) / cellSize);
        var yCellPos = Math.floor((yPosition + gameViewOriginY) / cellSize);
        
        if(blockStatus[xCellPos][yCellPos] == true) {
            //blockStatus[xCellPos][yCellPos] = false;
        } else {
            //blockStatus[xCellPos][yCellPos] = true;
            cellsLocation.push([xCellPos, yCellPos]);
        }
    }
}


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

function sendData(event) {
    gameSocket.send(tempy);
    //console.log(tempy);
}

function receiveData(event) {
        // Receiving a message from the server.
            // Text received from a WebSocket connection is in UTF-8 format.
    console.log(event.data);
    tempy = event.data;

        // This is an example of receiving a json object.
            // This example is in context to a chat client app.
    //var f = document.getElementById("chatbox").contentDocument;
    //var text = "";
    //var msg = JSON.parse(event.data);
    //var time = new Date(msg.date);
    //var timeStr = time.toLocaleTimeString();
    //
    //switch(msg.type) {
    //    case "id":
    //      clientID = msg.id;
    //      setUsername();
    //      break;
    //    case "username":
    //      text = "<b>User <em>" + msg.name + "</em> signed in at " + timeStr + "</b><br>";
    //      break;
    //    case "message":
    //      text = "(" + timeStr + ") <b>" + msg.name + "</b>: " + msg.text + "<br>";
    //      break;
    //    case "rejectusername":
    //      text = "<b>Your username has been set to <em>" + msg.name + "</em> because the name you chose is in use.</b><br>"
    //      break;
    //    case "userlist":
    //      var ul = "";
    //      for (i=0; i < msg.users.length; i++) {
    //        ul += msg.users[i] + "<br>";
    //      }
    //      document.getElementById("userlistbox").innerHTML = ul;
    //      break;
    //}
    //
    //if (text.length) {
    //    f.write(text);
    //    document.getElementById("chatbox").contentWindow.scrollByPages(1);
    //}
}
