let callSort4 = function() {
    startTime = Date.now();
    ctx = canv.getContext("2d");

    document.addEventListener("keydown", keyPush);
    sortFunc = sort4;
    sortNum = 4;
    prepare(50);
    render();
};


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
            console.log('hello')
            finished = true;
        }
    }

    // count2 += 1;
}