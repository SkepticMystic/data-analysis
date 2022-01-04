/**
 * Compute the Pearson correlation coefficient between two arrays of numbers.
 * @param {arraytype} xs - the first array of numbers
 * @param {arraytype} ys - the array of y values
 * @returns The correlation coefficient.
 */
export function pearsonCorrelation(xs: number[], ys: number[]) {
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
		(n * sum_xy - sum_x * sum_y) /
		Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y));

	return corr;
}
