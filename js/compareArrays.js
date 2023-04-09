export function compareArrays(firstArray, secondArray) {
    let equalArrays = firstArray.length === secondArray.length;
    //If arrays are of the same size we compare them
    if(equalArrays){
        for (let i = 0; i < firstArray.length && equalArrays; i++) {
            if(!(firstArray[i].toString() === secondArray[i].toString())){
                equalArrays = false;
            }
        }
    }
    console.log(equalArrays)
    return equalArrays;
}


export function containsArray(generalArray, newArray){
    let contains = false;
    for(let i = 0; i < generalArray.length && !contains; i++){
        contains = contains || (generalArray[i].toString() === newArray.toString());
    }

    return contains;
}