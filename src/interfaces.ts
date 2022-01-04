import { Link } from "obsidian-dataview";

export interface Settings {
	fieldsToCheck: string[];
	fieldLists: string[];
	dateFormat: string;
}

export type DataType = number | string | Date | Link;
