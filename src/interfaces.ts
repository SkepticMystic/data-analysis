import { Link } from "obsidian-dataview";

export interface Correlations {
	[field: string]: {
		[field: string]: {
			/** Pearson or Biserial Correlation based on input types */
			corr: number;
			/** Samples size */
			n: number;
		};
	};
}
export interface Settings {
	fieldsToCheck: string[];
	fieldLists: string[];
	dateFormat: string;
	defaultSavePath: string;
	nullValue: string;
	undefinedValue: string;
	addFileData: boolean;
	addNoteContent: boolean;
}

export type DataType = number | string | Date | Link;
