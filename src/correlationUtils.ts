export const buildAllPairs = (items: string[]): string[][] => {
	let results = [];

	for (let outerIndex = 0; outerIndex < items.length; outerIndex++) {
		let first = items[outerIndex]
		for (let innerIndex=outerIndex+1; innerIndex < items.length; innerIndex++) {
			results.push([first, items[innerIndex]])
		}
	}
	return results;
}