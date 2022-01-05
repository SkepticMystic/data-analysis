import { Settings } from "./interfaces";

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
