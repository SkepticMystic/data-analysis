export const splitAndTrim = (fields: string): string[] => {
	if (fields === "") return [];
	else return fields.split(",").map((str) => str.trim());
};

export function makeArr<T>(input: T | T[]): T[] {
	return [input].flat();
}

export const makeSub = (field: string, sub: string, connector = ".") =>
	field + connector + sub;

export function stringToNullOrUndefined(current: string) {
	if (current === "undefined") return undefined;
	else if (current === "null") return null;
	else return current;
}

export function arrayOverlap<T>(A: T[], B: T[]): [T[], T[]] {
	const iA: number[] = [];
	A.forEach((a, i) => {
		if (a !== undefined) iA.push(i);
	});
	const iB: number[] = [];
	B.forEach((b, i) => {
		if (b !== undefined) iB.push(i);
	});

	const aOverlap = A.filter((a, i) => iA.includes(i) && iB.includes(i));
	const bOverlap = B.filter((b, i) => iA.includes(i) && iB.includes(i));

	if (!aOverlap.length || !bOverlap.length) return [[], []];
	return [aOverlap, bOverlap];
}

export const toKebabCase = (input: string) =>
	input
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase();
