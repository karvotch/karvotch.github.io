let callSort3 = function() {
    startTime = Date.now();
    ctx = canv.getContext("2d");

    document.addEventListener("keydown", keyPush);
    sortFunc = sort3;
    sortNum = 3;
    prepare(50);
    render();
};


function sort3() {
    for(var i = count2+1; i > 0; i--) {
        if(intArray[i] < intArray[i-1]) {
            let temp1 = intArray[i-1];
            intArray[i-1] = intArray[i];
            intArray[i] = temp1;
        } else {
            break;
        }
    }

    count2 += 1;
}