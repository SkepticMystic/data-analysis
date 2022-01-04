import { Link } from "obsidian-dataview";

export interface Settings {
	fieldsToCheck: string[];
}

export type DataType = number | string | Date | Link;

// export interface Link {
// 	display: string;
// 	embed: boolean;
// 	path: string;
// 	subpath: string;
// 	type: "file";
// }
