"use strict";

function even(numArray) {
  return numArray.reduce((previous, current) => {
    if (current % 2 === 0) previous.push(current);
    return previous;
  }, []);
}

const orgArray = Array.from({ length: 10 }, (_, idx) => idx + 1);
const evenArray = even(orgArray);
console.log(`${orgArray} ${typeof orgArray}`);
console.log(`${evenArray} ${typeof evenArray}`);
