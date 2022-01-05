export const splitAndTrim = (fields: string): string[] => {
	if (fields === "") return [];
	else return fields.split(",").map((str) => str.trim());
};

export function makeArr<T>(input: T | T[]): T[] {
	return [input].flat();
}

export function stringToNullOrUndefined(current: string) {
	if (current === "undefined") return undefined;
	else if (current === "null") return null;
	else return current;
}
