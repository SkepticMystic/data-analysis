import { Menu } from "obsidian";
import { addFeatherIcon } from "obsidian-community-lib";
import { ChartModal } from "./ChartModal";
import { DECIMALS } from "./const";
import DataAnalysisPlugin from "./main";
import { StatsModal } from "./StatsModal";

export const splitAndTrim = (fields: string): string[] => {
	if (fields === "") return [];
	else return fields.split(",").map((str) => str.trim());
};

export function makeArr<T>(input: T | T[]): any[] {
	return [input].flat();
}

export const makeSub = (field: string, sub: string, connector = ".") =>
	field + connector + sub;

export function stringToNullOrUndefined(current: string) {
	if (current === "undefined") return undefined;
	else if (current === "null") return null;
	else return current;
}

export function arrayOverlap<T>(A: T[], B: T[]): [T[], T[]] {
	if (A.length !== B.length) return [[], []];

	const iA = A.filter((a) => a !== undefined).map((a, i) => i);
	const iB = B.filter((b) => b !== undefined).map((b, i) => i);
	const iOverlap = iA.filter((i) => iB.includes(i));

	const aOverlap = A.filter((a, i) => iOverlap.includes(i));
	const bOverlap = B.filter((b, i) => iOverlap.includes(i));

	return [aOverlap, bOverlap];
}

export const toKebabCase = (input: string) =>
	input
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase();

export const roundNumber = (num: number, dec: number = DECIMALS): number =>
	Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);

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
	const target = (<HTMLElement>event.target);
	const parentElement = (<HTMLTableRowElement>target.parentElement);

	const clickedCellText = tryParseNumber(target.innerText);

	const allCellTexts = Array.from(parentElement.cells).map(
		(el: HTMLTableCellElement) => tryParseNumber(el.textContent)
	) as [string, string, number];

	menu.addItem((item) =>
		item
			.setTitle("Open Chart Modal")
			.setIcon(addFeatherIcon("bar-chart-2") as string)
			.onClick(() => {
				new ChartModal(
					app,
					plugin,
					allCellTexts[0],
					allCellTexts[1]
				).open();
			})
	);
	if (!(typeof clickedCellText === "number")) {
		menu.addItem((item) =>
			item
				.setTitle("Open Stats Modal")
				.setIcon(addFeatherIcon("grid") as string)
				.onClick(() => {
					new StatsModal(app, plugin, clickedCellText).open();
				})
		);
	}
	menu.showAtMouseEvent(event);
}
