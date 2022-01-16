import { Link } from "obsidian-dataview";

export interface Correlations {
	[field: string]: {
		[field: string]: Correlation;
	};
}

export interface PrintableCorrelation {
	fieldA: string;
	fieldB: string;
	info: Correlation;
}

export interface Correlation {
	/** Pearson or Biserial Correlation based on input types */
	corr: number;
	/** Samples size */
	n: number;
}

export interface Settings {
	fieldsToCheck: string[];
	fieldsToIgnoreForCorrs: [string, string][];
	fieldLists: string[];
	dateFormat: string;
	defaultSavePath: string;
	nullValue: string;
	undefinedValue: string;
	addFileData: boolean;
	addNoteContent: boolean;
}

export type DataType = number | string | Date | Link;

export interface Row {
	[col: string]: any;
}

export interface SuperchargedField {
	name: string;
	values: string[];
}

export interface PresetField {
	id: string;
	isCycle: boolean;
	isMulti: boolean;
	name: string;
	values: { [id: number]: string };
	valuesListNotePath: string;
}
