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

export function makeArr<T>(input: T | T[]): T[] {
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
	const iA: number[] = [];
	A.forEach((a, i) => {
		if (a !== undefined) iA.push(i);
	});
	const iB: number[] = [];
	B.forEach((b, i) => {
		if (b !== undefined) iB.push(i);
	});

	const aOverlap = A.filter((a, i) => iA.includes(i) && iB.includes(i));
	const bOverlap = B.filter((b, i) => iA.includes(i) && iB.includes(i));

	if (!aOverlap.length || !bOverlap.length) return [[], []];
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
	const { target } = event;
	const { parentElement } = target;

	const clickedCellText = tryParseNumber(target.innerText);

	const allCellTexts = [...parentElement.cells].map(
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
