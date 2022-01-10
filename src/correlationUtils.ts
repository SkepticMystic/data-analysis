import { getPearsonCorrelation, getPointBiserialCorrelation } from "./analyses";
import { Correlations, DataType } from "./interfaces";
import { DateTime } from "luxon";

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

export const inferType = (
    xs: (string | number)[]
): "string" | "number" | "object" | "undefined" => {
    const defineds = xs.filter((x) => x);
    const types = defineds.map((x) => typeof x);
    if (!defineds.length) return "undefined";
    const thresh = defineds.length / 2;

    if (types.filter((x) => x === "number").length >= thresh)
        return "number";
    else if (types.filter((x) => x === "string").length >= thresh)
        return "string";
    else return "object";
}

export const splitAndTrim = (fields: string): string[] => {
	if (fields === "") return [];
	else return fields.split(",").map((str) => str.trim());
};

export const getInnerValue = (value: any) => {
    const unproxied = unproxy(value);
    if (unproxied.length === 1) {
        if (typeof unproxied[0] === "string") {
            let list = unproxied[0];
            if (list.startsWith("[") && list.endsWith("]")) {
                list = list.slice(1, -1);
            }
            const splits = splitAndTrim(list).map((item) => {
                if (item.startsWith(`"`) && item.endsWith(`"`)) {
                    return item.slice(1, -1);
                } else return item;
            });
            if (splits.length === 1) return splits[0];
            else return splits;
        } else {
            if (unproxied[0].type === "file") {
                return unproxied[0].path;
            } else return unproxied[0];
        }
    } else {
        if (unproxied[0].type === "file") {
            return unproxied.map((link) => link.path);
        } else return unproxied;
    }
}

export const unproxy = (item: any): DataType[] => {
    const unproxied = [];

    const queue = [item];
    while (queue.length) {
        const currItem = queue.shift();
        // "Proxy" for checking if `currItem` is a proxy
        if (typeof currItem.defaultComparator === "function") {
            const possibleUnproxied = Object.assign({}, currItem);
            const { values } = possibleUnproxied;
            if (values) queue.push(...values);
            else unproxied.push(possibleUnproxied);
        } else unproxied.push(currItem);
    }
    return unproxied;
}

export const processPages = (pages: { [field: string]: any }[],fieldsToCheck: string[]): {pages: { [field: string]: any }[], dates: DateTime[]} => {
    const dates: DateTime[] = [];
    pages.forEach((page) => {
        const potentialDate = DateTime.fromISO(page.file.name);
        if (potentialDate.isValid) dates.push(potentialDate);

        fieldsToCheck.forEach((field) => {
            const value = page[field];
            if (value) {
                page["hasFieldsOfInterest"] = true;
                page[field] = getInnerValue(value);
            }
        });
    });

    return {pages: pages.filter((page) => page.hasFieldsOfInterest), dates: dates}
}

export const buildAllPairs = (items: string[], sorted:boolean = false): string[][] => {
    if (!sorted) {
        items.sort(function (a, b) {
            return a.localeCompare(b);
        });
    }

	let results = [];

	for (let outerIndex = 0; outerIndex < items.length; outerIndex++) {
		let first = items[outerIndex]
		for (let innerIndex=outerIndex+1; innerIndex < items.length; innerIndex++) {
			results.push([first, items[innerIndex]])
		}
	}
	return results;
}

export const buildAllDataByFieldsToCheck = (data: { [field: string]: DataType }[], fieldsToCheck: string[]): { [field: string]: DataType[] } => {
    const dataByField: { [field: string]: DataType[] } = {};
    for (const field of fieldsToCheck) {
        dataByField[field] = data.map((page) => page[field]);
    }
    return dataByField;
}

export const refactoredBuildAllCorrelations = (data: { [field: string]: DataType }[], fieldsToCheck: string[], pairsToSkip: string[][] = [], debugMode: boolean = false): Correlations => {
    // Alphabetize fieldsToCheck list. This makes it easier to keep track of the correlation pairs.
    fieldsToCheck.sort(function (a, b) {
        return a.localeCompare(b);
    });

    // Alphabetize skip pairs. This allows us to easily remove pairs from the future correlation pair list.
    const alphabetizedSkipPairs: string[][] = []
    for (const skipPair of pairsToSkip) {
        skipPair.sort(function (a, b) {
            return a.localeCompare(b);
        });
        alphabetizedSkipPairs.push(skipPair);
    }

    const corrs: Correlations = {}
    const dataByField = buildAllDataByFieldsToCheck(data, fieldsToCheck);

    // Build all correlation pairs. Filter out any of the skip pairs.
    const pairs = buildAllPairs(fieldsToCheck, true).filter((value: string[]) => !alphabetizedSkipPairs.includes(value));

    for (const pair of pairs) {
        const fieldA = pair[0];
        const fieldB = pair[1];
        const fieldAData = dataByField[fieldA];
        const fieldBData = dataByField[fieldB];

        buildCorrelation(fieldA, fieldB, fieldAData, fieldBData, corrs);
    }

    if (debugMode) {
        console.log({ corrs });
    }

    return corrs;
}

const buildCorrelationNumberAndObject = (numberField: string, numberFieldData: DataType[], objectField: string, objectFieldData: DataType[], corrs: Correlations): Correlations => {
    if (!corrs[numberField]) {
        corrs[numberField] = {};
    }

    const oA = numberFieldData.filter((a) => a);
    const oB = (objectFieldData as string[][]).filter(
        (b, i) => numberFieldData[i] !== undefined
    );

    const uniqueStrs = [...new Set(oB.flat())].filter(
        (str) => typeof str === "string"
    );
    uniqueStrs.forEach((subF) => {
        const subA = oA;
        const subB = oB.map((b) =>
            b && b.includes(subF) ? 1 : 0
        );
        const corr = getPointBiserialCorrelation(subB, subA);
        corrs[numberField][objectField + "." + subF] = corr
            ? { corr, n: subA.length }
            : null;
    });

    return corrs;
}

const buildCorrelationNumberAndString = (stringField: string, stringFieldData: DataType[], numberField: string, numberFieldData: DataType[], corrs: Correlations): Correlations => {
    if (!corrs[numberField]) {
        corrs[numberField] = {};
    }

    const oA = numberFieldData.filter((a: any) => a);
    const oB = stringFieldData
        .filter((b, i) => numberFieldData[i] !== undefined)
        .map((b) => b ?? 0);

    const uniqueStrs = [...new Set(oB)].filter(
        (str) => typeof str === "string"
    );
    uniqueStrs.forEach((subF) => {
        const subA = oA;
        const subB = oB.map((b) => (b === subF ? 1 : 0));

        const corr = getPointBiserialCorrelation(subB, subA);
        corrs[numberField][stringField + "." + subF] = corr
            ? { corr, n: subA.length }
            : null;
    });

    return corrs;
}

export const buildCorrelation = (fieldA: string, fieldB: string, fieldAData: DataType[], fieldBData: DataType[], corrs: Correlations): Correlations => {
    if (fieldA == fieldB) {
        return;
    }

    if (!corrs[fieldA]) {
        corrs[fieldA] = {};
    }

    const fieldAType = inferType(fieldAData);
    const fieldBType = inferType(fieldBData);

    if (fieldAType === "number" && fieldBType === "number") {
        const [oA, oB] = arrayOverlap(fieldAData, fieldBData);
        const corr = getPearsonCorrelation(oA, oB);
        corrs[fieldA][fieldB] = corr ? { corr, n: oA.length } : null;
    } else if (fieldAType === "number" && fieldBType === "string") {
        corrs = buildCorrelationNumberAndString(fieldB, fieldBData, fieldA, fieldAData, corrs);
    } else if (fieldAType === "number" && fieldBType === "object") {
        corrs = buildCorrelationNumberAndObject(fieldA, fieldAData, fieldB, fieldBData, corrs);
    } else if (fieldAType === "string" && fieldBType === "string") {
        corrs[fieldA][fieldB] = null;
    } else if (fieldAType === "string" && fieldBType === "number") {
        corrs = buildCorrelationNumberAndString(fieldA, fieldAData, fieldB, fieldBData, corrs);
    } else if (fieldAType === "string" && fieldBType === "object") {
        corrs[fieldA][fieldB] = null;
    } else if (fieldAType === "object" && fieldBType === "object") {
        corrs[fieldA][fieldB] = null;
    } else if (fieldAType === "object" && fieldBType === "number") {
        corrs = buildCorrelationNumberAndObject(fieldB, fieldBData, fieldA, fieldAData, corrs);
    } else if (fieldAType === "object" && fieldBType === "string") {
        corrs[fieldA][fieldB] = null;
    }

    return corrs;
}

export const buildAllCorrelations = (data: { [field: string]: DataType }[], fieldsToCheck: string[], debugMode: boolean = false): Correlations => {
    const corrs: Correlations = {};

    for (const fA of fieldsToCheck) {
        corrs[fA] = {};
        const vA = data.map((d) => d[fA]);
        const tA = inferType(vA);
        for (const fB of fieldsToCheck) {
            if (fA === fB) continue;
            const vB = data.map((d) => d[fB]);
            const tB = inferType(vB);

            if (tA === "number" && tB === "number") {
                if (corrs[fB]?.[fA]) continue;
                const [oA, oB] = arrayOverlap(vA, vB);
                const corr = getPearsonCorrelation(oA, oB);
                corrs[fA][fB] = corr ? { corr, n: oA.length } : null;
            } else if (tA === "number" && tB === "string") {
                const oA = vA.filter((a) => a);
                const oB = vB
                    .filter((b, i) => vA[i] !== undefined)
                    .map((b) => b ?? 0);

                const uniqueStrs = [...new Set(oB)].filter(
                    (str) => typeof str === "string"
                );
                uniqueStrs.forEach((subF) => {
                    const subA = oA;
                    const subB = oB.map((b) => (b === subF ? 1 : 0));

                    const corr = getPointBiserialCorrelation(subB, subA);
                    corrs[fA][fB + "." + subF] = corr
                        ? { corr, n: subA.length }
                        : null;
                });
            } else if (tA === "number" && tB === "object") {
                const oA = vA.filter((a) => a);
                const oB = (vB as string[][]).filter(
                    (b, i) => vA[i] !== undefined
                );

                const uniqueStrs = [...new Set(oB.flat())].filter(
                    (str) => typeof str === "string"
                );
                uniqueStrs.forEach((subF) => {
                    const subA = oA;
                    const subB = oB.map((b) =>
                        b && b.includes(subF) ? 1 : 0
                    );
                    const corr = getPointBiserialCorrelation(subB, subA);
                    corrs[fA][fB + "." + subF] = corr
                        ? { corr, n: subA.length }
                        : null;
                });
            } else if (tA === "string" && tB === "string") {
                corrs[fA][fB] = null;
            } else if (tA === "string" && tB === "number") {
            } else if (tA === "string" && tB === "object") {
                corrs[fA][fB] = null;
            } else if (tA === "object" && tB === "object") {
                corrs[fA][fB] = null;
            } else if (tA === "object" && tB === "number") {
            } else if (tA === "object" && tB === "string") {
                corrs[fA][fB] = null;
            }
        }
    }
    if (debugMode) {
        console.log({ corrs });
    }
    return corrs;
}