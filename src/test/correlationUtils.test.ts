import {buildAllCorrelations, buildAllPairs} from "../correlationUtils";
import { correlations, fieldsToCheck, fileData } from "./testData";

function factorial(num: number): number {
    if (num < 0) 
            return -1;
    else if (num == 0) 
        return 1;
    else {
        return (num * factorial(num - 1));
    }
}

test('buildAllPairs creates correlation pairs without missing any fields and without duplicates', () => {
    const input = ["apple", "banana", "strawberries", "pears", "grapefruit", "bread", "milk"]
    const results = buildAllPairs(input)
    expect(results.length).toEqual(factorial(input.length)/(2*factorial(input.length-2)));
    expect(results).toEqual([["apple", "banana",], ["apple", "strawberries",], ["apple", "pears",], ["apple", "grapefruit",], ["apple", "bread",], ["apple", "milk",], ["banana", "strawberries",], ["banana", "pears",], ["banana", "grapefruit",], ["banana", "bread",], ["banana", "milk",], ["strawberries", "pears",], ["strawberries", "grapefruit",], ["strawberries", "bread",], ["strawberries", "milk",], ["pears", "grapefruit",], ["pears", "bread",], ["pears", "milk",], ["grapefruit", "bread",], ["grapefruit", "milk",], ["bread", "milk",],])
})

test('buildAllCorrelations creates all correlation pairs', () => {
    expect(buildAllCorrelations(fileData, fieldsToCheck)).toEqual(correlations)
})