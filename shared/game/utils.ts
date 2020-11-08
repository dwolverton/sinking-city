import { shuffle } from 'lodash';

export function createShuffledNumbersArray(count:number):number[] {
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(i);
    }
    arr = shuffle(arr);
    return arr;
}