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
    for(var i = 1; i < max-count2; i++) {
        if(intArray[count2+i] < intArray[isLess]) {
            if(count2 > 97) {
                console.log(count2+i);
                console.log(isLess);
            }
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
