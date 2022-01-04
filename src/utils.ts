export const splitAndTrim = (fields: string): string[] => {
	if (fields === "") return [];
	else return fields.split(",").map((str) => str.trim());
};

export function makeArr<T>(input: T | T[]): T[] {
	return [input].flat();
}
