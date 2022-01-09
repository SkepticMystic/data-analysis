/**
 * Takes an array of strings and returns an array of all possible pairs of strings in the array.
 *
 * Avoids diagonals.
 * @param {string[]} items - The array of strings to pair.
 * @returns A list of all pairs of items from the list.
 */
export const buildAllPairs = (items: string[]): string[][] => {
	const results = [];
	for (let outerIndex = 0; outerIndex < items.length; outerIndex++) {
		let first = items[outerIndex];
		for (
			// Skip the diagonal
			let innerIndex = outerIndex + 1;
			// REVIEW: Can't we make this `innerIndex < outerIndex`, to avoid the duplicates in the first place? But then the `results` array won't be square
			innerIndex < items.length;
			innerIndex++
		) {
			results.push([first, items[innerIndex]]);
		}
	}
	return results;
};
