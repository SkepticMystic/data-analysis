import {buildReportCorrs, ALL_FIELDS} from "../reportViewUtils";
import { shortCorrelations } from "./testData";

test('buildReportCorrs properly filters out correlations below a min and max', () => {
    const results = buildReportCorrs(shortCorrelations, ALL_FIELDS, 0.8, 0.44);
    expect(results.length).toEqual(1);
    expect(results[0]).toEqual({fieldA: "numberField2", fieldB: "stringField1.CnwaWBTgW", info: {corr: 0.75, n:10}});
})

test('buildReportCorrs properly flattens list of Correlations', () => {
    const results = buildReportCorrs(shortCorrelations, ALL_FIELDS, 0.5, -0.1);
    expect(results.length).toEqual(2);
    expect(results).toContainEqual({fieldA: "numberField1", fieldB: "stringField1.XCUXGKZ", info: {corr: -0.07, n:10}});
    expect(results).toContainEqual({fieldB: "numberField2", fieldA: "binaryField1", info: {corr: 0.4357993349945433, n:10}});
})

test('buildReportCorrs filters out non-selected fields', () => {
    const results = buildReportCorrs(shortCorrelations, "numberField1", -0.3, -0.8);
    expect(results.length).toEqual(2);
    expect(results).toContainEqual({fieldA: "numberField1", fieldB: "numberField2", info: {corr: -0.4594446427674563, n:10}});
    expect(results).toContainEqual({fieldA: "binaryField1", fieldB: "numberField1", info: {corr: -0.7014895051088776, n:10}});
})