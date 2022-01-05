import { Link } from "obsidian-dataview";

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
