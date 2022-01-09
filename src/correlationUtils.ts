import { getPearsonCorrelation, getPointBiserialCorrelation } from "./analyses";
import { Correlations, DataType } from "./interfaces";

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

export const buildAllCorrelations = (data: { [field: string]: DataType }[], fieldsToCheck: string[]): Correlations => {
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
    // console.log({ corrs });
    return corrs;
}