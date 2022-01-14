import { PrintableCorrelation, Correlations } from "./interfaces";

export const ALL_FIELDS = "All Fields";

export const buildReportCorrs = (
	corrs: Correlations,
	selectedField: string,
	max: number,
	min: number
): PrintableCorrelation[] => {
	if (corrs === undefined) return [];
	const fields = Object.keys(corrs);
	const corrsToShow = fields
		.map((fieldA) => {
			const correlatedFields = Object.keys(corrs[fieldA]);
			return correlatedFields.map((fieldB) => {
				return { fieldA, fieldB, info: corrs[fieldA][fieldB] };
			});
		})
		.flat()
		.filter((item) => {
			const { info } = item;
			const fieldSelected =
				selectedField == ALL_FIELDS ||
				item.fieldA == selectedField ||
				item.fieldB == selectedField;
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

export const buildDropdownOptionsFromReportCorrs = (printableCorrs: PrintableCorrelation[]): string[] => {
	const fieldOptions = new Set<string>();
	printableCorrs.forEach((corr: PrintableCorrelation) => {
		fieldOptions.add(corr.fieldA);
		fieldOptions.add(corr.fieldB);
	})
	const results = Array.from(fieldOptions);
	results.sort(function (a, b) {
		return a.localeCompare(b);
	});
	return results;
};

export const top3PositiveCorrs = (
	correlations: PrintableCorrelation[],
	sorted: boolean = true
): PrintableCorrelation[] => {
	if (!sorted) {
		correlations.sort((a, b) => b.info.corr - a.info.corr);
	}
	return correlations.slice(0, 3);
};

export const top3NegativeCorrs = (
	correlations: PrintableCorrelation[],
	sorted: boolean = true
): PrintableCorrelation[] => {
	if (!sorted) {
		correlations.sort((a, b) => b.info.corr - a.info.corr);
	}
	return correlations.slice(-3);
};
