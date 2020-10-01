let callSort1 = function() {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canv.width, canv.height);
    startTime = Date.now();

    sortFunc = sort1;
    sortNum = 1;
    prepare(10);
    render();
};


function sort1() {
    count2 += 1;
    if(count2 >= max) {
        count2 = 1;
        max -= 1;
    }
    if(intArray[count2-1] > intArray[count2]) {
        let temp1 = intArray[count2];
        intArray[count2] = intArray[count2-1];
        intArray[count2-1] = temp1;
    }
}