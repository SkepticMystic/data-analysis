import {
	buildAllCorrelations,
	buildAllPairs,
	processPages,
} from "../correlationUtils";
import {
	correlationsNoDuplicates,
	fieldsToCheck,
	fileData,
} from "./testData";

function factorial(num: number): number {
	if (num < 0) return -1;
	else if (num == 0) return 1;
	else {
		return num * factorial(num - 1);
	}
}

test("buildAllPairs creates correlation pairs without missing any fields and without duplicates", () => {
	const input = [
		"apple",
		"banana",
		"strawberries",
		"pears",
		"grapefruit",
		"bread",
		"milk",
	];
	const results = buildAllPairs(input, []);
	expect(results.length).toEqual(
		factorial(input.length) / (2 * factorial(input.length - 2))
	);
	expect(results).toEqual([
		["apple", "banana"],
		["apple", "bread"],
		["apple", "grapefruit"],
		["apple", "milk"],
		["apple", "pears"],
		["apple", "strawberries"],
		["banana", "bread"],
		["banana", "grapefruit"],
		["banana", "milk"],
		["banana", "pears"],
		["banana", "strawberries"],
		["bread", "grapefruit"],
		["bread", "milk"],
		["bread", "pears"],
		["bread", "strawberries"],
		["grapefruit", "milk"],
		["grapefruit", "pears"],
		["grapefruit", "strawberries"],
		["milk", "pears"],
		["milk", "strawberries"],
		["pears", "strawberries"],
	]);
});

test("buildAllPairs skips pairs properly if pairs are alphabetized", () => {
	const input = [
		"apple",
		"banana",
		"strawberries",
		"pears",
		"grapefruit",
		"bread",
		"milk",
	];
	const results = buildAllPairs(input, [["apple", "banana"], ["grapefruit", "milk"]]);
	expect(results.length).toEqual(
		factorial(input.length) / (2 * factorial(input.length - 2)) - 2
	);
	expect(results).toEqual([
		["apple", "bread"],
		["apple", "grapefruit"],
		["apple", "milk"],
		["apple", "pears"],
		["apple", "strawberries"],
		["banana", "bread"],
		["banana", "grapefruit"],
		["banana", "milk"],
		["banana", "pears"],
		["banana", "strawberries"],
		["bread", "grapefruit"],
		["bread", "milk"],
		["bread", "pears"],
		["bread", "strawberries"],
		["grapefruit", "pears"],
		["grapefruit", "strawberries"],
		["milk", "pears"],
		["milk", "strawberries"],
		["pears", "strawberries"],
	]);
});

test("only load file data for files that have metadata of interest to us", () => {
	const result = processPages(fileData, fieldsToCheck);
	expect(result.pages.length).toEqual(fileData.length - 2);
});

test("buildAllCorrelations creates all correlation pairs", () => {
	// const actualCorrelations = buildAllCorrelations(
	// 	fileData,
	// 	fieldsToCheck,
	// 	[]
	// );
	// expect(actualCorrelations).toEqual(correlationsNoDuplicates);
});
