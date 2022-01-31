import { PrintableCorrelation, Correlations } from "./interfaces";

export const ALL_FIELDS = "All Fields";

export const buildPrintableCorrs = (
	corrs: Correlations
): PrintableCorrelation[] => {
	if (corrs === undefined) return [];
	const fields = Object.keys(corrs);
	return fields
		.map((fieldA) => {
			const correlatedFields = Object.keys(corrs[fieldA]);
			return correlatedFields.map((fieldB) => {
				return { fieldA, fieldB, info: corrs[fieldA][fieldB] };
			});
		})
		.flat();
};

export const getReportCorrs = (
	printableCorrs: PrintableCorrelation[],
	selectedField: string,
	max: number,
	min: number
): PrintableCorrelation[] => {
	const corrsToShow = printableCorrs
		.filter((item) => {
			const { info, fieldA, fieldB } = item;
			const fieldSelected =
				selectedField == ALL_FIELDS ||
				fieldA == selectedField ||
				fieldB == selectedField;
			return (
				info &&
				fieldSelected &&
				info.corr !== NaN &&
				info.corr <= max &&
				info.corr >= min
			);
		})
		.sort((a, b) => b.info.corr - a.info.corr);

	return corrsToShow;
};

export const buildDropdownOptionsFromCorrs = (
	printableCorrs: PrintableCorrelation[]
): string[] => {
	const fieldOptions = new Set<string>();
	printableCorrs.forEach((corr: PrintableCorrelation) => {
		fieldOptions.add(corr.fieldA);
		fieldOptions.add(corr.fieldB);
	});
	const results = Array.from(fieldOptions);
	return results.sort((a, b) => a.localeCompare(b));
};

export const top3PositiveCorrs = (
	correlations: PrintableCorrelation[],
	sorted: boolean = true
): PrintableCorrelation[] => {
	if (!sorted) correlations.sort((a, b) => b.info.corr - a.info.corr);
	return correlations.slice(0, 3);
};

export const top3NegativeCorrs = (
	correlations: PrintableCorrelation[],
	sorted: boolean = true
): PrintableCorrelation[] => {
	if (!sorted) correlations.sort((a, b) => b.info.corr - a.info.corr);
	return correlations.slice(-3);
};

export const ariaN = (n: number) => (n ? "n: " + n.toFixed() : "");
