let callSort2 = function() {
    startTime = Date.now();
    ctx = canv.getContext("2d");

    document.addEventListener("keydown", keyPush);
    sortFunc = sort2;
    sortNum = 2;
    prepare(50);
    render();
};


function sort2() {
    let isLess = count2;
    for(var i = 0; i < max; i++) {
        if(intArray[count2+i] < intArray[isLess]) {
            isLess = count2+i;
        }
    }
    if(count2 != isLess) {
        let temp1 = intArray[count2];
        intArray[count2] = intArray[isLess];
        intArray[isLess] = temp1;
    }

    count2 += 1;
}