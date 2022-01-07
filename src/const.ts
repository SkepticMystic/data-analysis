import { Settings } from "./interfaces";

export const CORRELATION_VIEW = "correlation-view";

/** Number of decimals places to round to, by default */
export const DECIMALS = 4;

export const DEFAULT_SETTINGS: Settings = {
	fieldsToCheck: [],
	fieldLists: [],
	dateFormat: "YYYY-MM-DD",
	defaultSavePath: "/",
	nullValue: "null",
	undefinedValue: "undefined",
	addFileData: false,
	addNoteContent: false,
};

export const splitLinksRegex = new RegExp(/\[\[(.*?)\]\]/g);
export const dropHeaderOrAlias = new RegExp(/\[\[([^#|]*)\]\]/);
