/**
 * Compute the Pearson correlation coefficient between two arrays of numbers.
 * @param {arraytype} xs - the first array of numbers
 * @param {arraytype} ys - the array of y values
 * @returns The correlation coefficient.
 */
export function getPearsonCorrelation(
	xs: number[],
	ys: number[],
	skipQuantCheck = false
) {
	if (xs.length <= 1 || ys.length <= 1) return null;

	if (!skipQuantCheck && (!isQuant(xs) || !isQuant(ys))) return null;

	const n = xs.length;
	if (n !== ys.length) throw new Error("Arrays must be the same length");

	let sum_x = 0;
	let sum_y = 0;
	let sum_xy = 0;
	let sum_xx = 0;
	let sum_yy = 0;

	for (let i = 0; i < n; i++) {
		const x = xs[i];
		const y = ys[i];
		sum_x += x;
		sum_y += y;
		sum_xx += x * x;
		sum_yy += y * y;
		sum_xy += x * y;
	}

	const corr =
		(n * sum_xy - sum_x * sum_y)
	// /
	// Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y));

	return corr;
}

/**
 * Given a set of binary values and a set of quantitative values, return the point-biserial
correlation coefficient.
 * @param {(number | boolean)[]} xs - The array of binary values.
 * @param {number[]} ys - the dependent variable
 * @returns The point biserial correlation.
 */
export function getPointBiserialCorrelation(
	xs: (number | boolean)[],
	ys: number[]
) {
	if (xs.length <= 1 || ys.length <= 1 || !isBinary(xs) || !isQuant(ys))
		return null;

	const m0: number[] = [],
		m1: number[] = [];
	xs.forEach((x, i) => {
		const y = ys[i];
		if (!x) m0.push(y);
		else m1.push(y);
	});

	return (
		((m1.length - m0.length) / getStdDev(ys)) *
		Math.sqrt((m1.length * m0.length) / xs.length)
	);
}

/**
 * Checks if all values in `xs` are numbers
 * @param {number[]} xs - The array of numbers to check.
 * @returns {boolean}
 */
export function isQuant(xs: number[]): boolean {
	return xs.length && xs.every((x) => typeof x === "number");
}

/**
 * Checks if the given array only contains `0`'s and `1`'s, or `true`'s and `false`'s.
 * @param {(number | boolean)[]} xs - The array of values to check.
 * @returns {boolean}
 */
export function isBinary(xs: (number | boolean)[]): boolean {
	return (
		xs.length &&
		xs.every((x) => x === 0 || x === 1 || x === false || x === true)
	);
}

/**
 * Compute the mean of a list of numbers.
 *
 * Checks if {@link isQuant}.
 * @param {number[]} xs - The array of numbers to compute the mean of.
 * @returns The mean of `xs`.
 */
export function getMean(xs: number[]) {
	if (!isQuant(xs)) return null;
	return xs.reduce((a, b) => a + b) / xs.length;
}

/**
 * Given a list of numbers, return the median of the list.
 *
 * Checks if {@link isQuant}.
 * @param {number[]} xs - The array of numbers to be sorted
 * @returns The median of the array.
 */
export function getMedian(xs: number[]) {
	if (!isQuant(xs)) return null;
	const sorted = xs.slice().sort((a, b) => a - b);
	return sorted[Math.floor(sorted.length / 2)];
}

/**
 * Given a list of items, return the most common item.
 * @param {(string | number | string[] | number[])[]} xs - The array of values to count.
 * @returns {string[]} The mode(s) of the array.
 */
export function getMode(
	xs: (string | number | string[] | number[])[]
): string[] {
	// TODO: Check the dataType of the array.
	const flattened = xs.flat();
	const counts: { [item: string | number]: number } = {};
	flattened.forEach((x) => {
		if (counts[x]) counts[x] = counts[x] + 1;
		else counts[x] = 1;
	});
	const max = Math.max(...Object.values(counts));
	return Object.keys(counts).filter((x) => counts[x] === max);
}

/**
 * Calculate the variance of a set of numbers.
 *
 * Checks if {@link isQuant}.
 * @param {number[]} xs - The array of numbers to be analyzed
 * @returns The variance of the array.
 */
export function getVariance(xs: number[]) {
	if (!isQuant(xs)) return null;
	const mean = getMean(xs);
	return xs.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / xs.length;
}

/**
 * Compute the standard deviation of a set of numbers.
 *
 * Checks if {@link isQuant}.
 * @param {number[]} xs - the array of numbers to be analyzed
 * @returns The standard deviation of the array.
 */
export function getStdDev(xs: number[]) {
	if (!isQuant(xs)) return null;
	return Math.sqrt(getVariance(xs));
}
