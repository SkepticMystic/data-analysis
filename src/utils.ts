import { Menu } from "obsidian";
import { addFeatherIcon } from "obsidian-community-lib";
import { ChartModal } from "./ChartModal";
import { DECIMALS } from "./const";
import DataAnalysisPlugin from "./main";
import { StatsModal } from "./StatsModal";

/**
 * Split a string by a delimiter and trim the resulting strings.
 * @param {string} fields - The string to split
 * @param {string} [split=","] - The string to split the fields on.
 * @returns An array of strings.
 */
export const splitAndTrim = (fields: string, split: string = ","): string[] => {
	if (fields === "") return [];
	else return fields.split(split).map((str) => str.trim());
};

/**
 * Make a flat array out of the input.
 * @param {T | T[]} input - The input to flatten.
 * @returns The array of the input.
 */
export const makeArr = <T>(input: T | T[]) => [input].flat();

/**
 * Create a new field name by concatenating the original field name with the sub field name.
 * @param {string} field - the name of the field to be modified
 * @param {string} sub - the name of the sub-field
 * @param {string} [connector="."] - the string to use to join the field and sub
 * @returns The string `"field.sub"`
 */
export const makeSub = (field: string, sub: string, connector = ".") =>
	field + connector + sub;

/**
 * If the string is `"undefined"`, return `undefined`. If the string is `"null"`, return `null`. Otherwise,
return `str`.
 * @param {string} str - The string to convert
 * @returns {undefined | null | string}
 */
export function stringToNullOrUndefined(
	str: string
): undefined | null | string {
	if (str === "undefined") return undefined;
	else if (str === "null") return null;
	else return str;
}

/**
 * Given two arrays, return the elements that are common to both.
 *
 * An element is common to both if the value at that index is !== undefined in both arrays.
 * @param {arraytype} A - The first array.
 * @param {arraytype} B - The array of values to be compared against
 * @returns {[T[], T[]]}
 */
export function arrayOverlap<T>(A: T[], B: T[]): [T[], T[]] {
	if (A.length !== B.length) return [[], []];

	const iA = A.filter((a) => a !== undefined).map((a, i) => i);
	const iB = B.filter((b) => b !== undefined).map((b, i) => i);
	const iOverlap = iA.filter((i) => iB.includes(i));

	const aOverlap = A.filter((a, i) => iOverlap.includes(i));
	const bOverlap = B.filter((b, i) => iOverlap.includes(i));

	return [aOverlap, bOverlap];
}

/**
 * Convert a string to kebab case. [Source](https://www.geeksforgeeks.org/how-to-convert-a-string-into-kebab-case-using-javascript/)
 * @param {string} input
 * @returns {string}
 */
export const toKebabCase = (input: string): string =>
	input
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase();

/**
 * Round a number to a given number of decimal places.
 * @param {number} num - The number to round.
 * @param {number} [dec=DECIMALS] - The number of decimal places to round to. Default to {@link DECIMALS}.
 * @returns {number} The rounded number.
 */
export const roundNumber = (num: number, dec: number = DECIMALS): number =>
	Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);

/**
 * Try to parse the input as a number, returning the input if it fails.
 * @param {string} input - The string to parse
 * @returns {string | number}
 */
export const tryParseNumber = (input: string): number | string => {
	const num = Number.parseFloat(input);
	return isNaN(num) ? input : num;
};

export function menuForChartNStatsModal(
	event: MouseEvent,
	plugin: DataAnalysisPlugin
) {
	const { app } = plugin;
	const menu = new Menu(app);
	const target = <HTMLElement>event.target;
	const parentElement = <HTMLTableRowElement>target.parentElement;

	const clickedCell = tryParseNumber(target.innerText);

	const row = Array.from(parentElement.cells).map(
		(el: HTMLTableCellElement) => tryParseNumber(el.textContent)
	) as [string, string, number];

	menu.addItem((item) =>
		item
			.setTitle("Open Chart Modal")
			.setIcon(<string>addFeatherIcon("bar-chart-2"))
			.onClick(() => {
				new ChartModal(app, plugin, row[0], row[1]).open();
			})
	);
	if (typeof clickedCell === "string") {
		menu.addItem((item) =>
			item
				.setTitle("Open Stats Modal")
				.setIcon(<string>addFeatherIcon("grid"))
				.onClick(() => {
					new StatsModal(app, plugin, clickedCell).open();
				})
		);
	}
	menu.showAtMouseEvent(event);
}
