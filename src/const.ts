import { Settings } from "./interfaces";
import { roundNumber } from "./utils";

export const CORRELATION_VIEW = "correlation-view";
export const CORRELATION_REPORT_VIEW = "correlation-report-view";

/** Number of decimals places to round to, by default.
 *
 * Used as a default in {@link roundNumber}.
 */
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

/** Grabs all wikilinks out of a string */
export const splitLinksRegex = new RegExp(/\[\[(.*?)\]\]/g);
/** Returns only the note name from a wikilink */
export const dropHeaderOrAlias = new RegExp(/\[\[([^#|]*)\]\]/);
