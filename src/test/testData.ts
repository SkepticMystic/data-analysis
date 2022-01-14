import { Correlations } from "../interfaces";

export const fieldsToCheck = ["stringField1", "listField1", "binaryField1", "numberField1", "numberField2"];

export const fileData = [
    {'file':{'name': 'testName2', }, 'stringField1': 'CnwaWBTgW', 'listField1': ['albGvprFAoz', 'JD'], 'binaryField1': 1, 'numberField1': 77.849, 'numberField2': 259.958},
    {'file':{'name': 'testName1', }, 'stringField1': 'XCUXGKZ', 'listField1': ['EabjwQ', 'e', 'qatCgD'], 'binaryField1': 0, 'numberField1': 274.535, 'numberField2': 5.647},
    {'file':{'name': 'testName3', }, 'stringField1': 'JEXtu', 'listField1': ['sIwdecDhIc', 'GDNqLgfswKvS', 'wfDwR', 'HWqu', 'HfZ'], 'binaryField1': 1, 'numberField1': 56.283, 'numberField2': 178.568},
    {'file':{'name': 'testName4', }, 'stringField1': 'ovlYIZvNEGH', 'listField1': ['JhGLLp', 'kzJun', 'ubx', 'o'], 'binaryField1': 0, 'numberField1': 270.205, 'numberField2': 73.883},
    {'file':{'name': 'testName5', }, 'stringField1': 'ZDALoPKRqrE', 'listField1': ['Mx', 'gbLvOxUZEsR', 'US'], 'binaryField1': 1, 'numberField1': 119.627, 'numberField2': 263.73},
    {'file':{'name': 'testName6', }, 'stringField1': 'ck', 'listField1': ['GBBndZIXpXQL', 'FofNqIK', 'o', 'BFP', 'Hhvl', 'WZnWPL', 'KxkHTX', 'h', 'QGCZAuu'], 'binaryField1': 0, 'numberField1': 27.034, 'numberField2': 148.553},
    {'file':{'name': 'testName7', }, 'stringField1': 'CWoz', 'listField1': ['ArhXkNR', 'k', 'xobYLm', 'zjGXQWOauP', 'KOAPYYwkePh', 'Tn', 'lvlTjphyw', 'TwfsK', 'EpaufavaeeEG', 'r', 'NmZSvq', 'KYUFwG'], 'binaryField1': 0, 'numberField1': 195.494, 'numberField2': 272.262},
    {'file':{'name': 'testName8', }, 'stringField1': 'kpTNrBoB', 'listField1': ['ulJNrxoCHc', 'GFxmKTcTLJY'], 'binaryField1': 0, 'numberField1': 290.509, 'numberField2': 141.678},
    {'file':{'name': 'testName9', }, 'stringField1': 'QsabNpsAxWHN', 'listField1': ['ozIHn', 'bxg', 'QOJDt', 'zEgrEevsuEqa', 'Qz', 'ccDyYIUc', 'HhJ', 'Px', 'Wfp', 'FKEmQv', 'mjP', 'euWRYLUPvjC'], 'binaryField1': 1, 'numberField1': 63.356, 'numberField2': 63.994},
    {'file':{'name': 'testName10',},  'stringField1': 'iph', 'listField1': ['ocdfymhL'], 'binaryField1': 1, 'numberField1': 27.382, 'numberField2': 291.091},
    {'file':{'name': 'testName11',},  'randomField': 'iph', 'randomField2': ['ocdfymhL']},
    {'file':{'name': 'testName12',},  'randomField': 'iph', 'randomField2': ['ocdfymhL']}
];

export const correlationsNoDuplicates: Correlations = {
    "listField1":{"stringField1":null},
    "binaryField1":{
        "stringField1.XCUXGKZ":{corr: -Infinity,n:5},
        "stringField1.CnwaWBTgW":{corr: -Infinity,n:5},
        "stringField1.JEXtu":{corr: -Infinity,n:5},
        "stringField1.ovlYIZvNEGH":{corr: -Infinity,n:5},
        "stringField1.ZDALoPKRqrE":{corr: -Infinity,n:5},
        "stringField1.ck":{corr: -Infinity,n:5},
        "stringField1.CWoz":{corr: -Infinity,n:5},
        "stringField1.kpTNrBoB":{corr: -Infinity,n:5},
        "stringField1.QsabNpsAxWHN":{corr: -Infinity,n:5},
        "stringField1.iph":{corr: -Infinity,n:5},
        "listField1.EabjwQ":{corr: -Infinity,n:5},
        "listField1.e":{corr: -Infinity,n:5},
        "listField1.qatCgD":{corr: -Infinity,n:5},
        "listField1.albGvprFAoz":{corr: -Infinity,n:5},
        "listField1.JD":{corr: -Infinity,n:5},
        "listField1.sIwdecDhIc":{corr: -Infinity,n:5},
        "listField1.GDNqLgfswKvS":{corr: -Infinity,n:5},
        "listField1.wfDwR":{corr: -Infinity,n:5},
        "listField1.HWqu":{corr: -Infinity,n:5},
        "listField1.HfZ":{corr: -Infinity,n:5},
        "listField1.JhGLLp":{corr: -Infinity,n:5},
        "listField1.kzJun":{corr: -Infinity,n:5},
        "listField1.ubx":{corr: -Infinity,n:5},
        "listField1.o":{corr: -Infinity,n:5},
        "listField1.Mx":{corr: -Infinity,n:5},
        "listField1.gbLvOxUZEsR":{corr: -Infinity,n:5},
        "listField1.US":{corr: -Infinity,n:5},
        "listField1.GBBndZIXpXQL":{corr: -Infinity,n:5},"listField1.FofNqIK":{corr: -Infinity,n:5},"listField1.BFP":{corr: -Infinity,n:5},"listField1.Hhvl":{corr: -Infinity,n:5},
        "listField1.WZnWPL":{corr: -Infinity,n:5},"listField1.KxkHTX":{corr: -Infinity,n:5},"listField1.h":{corr: -Infinity,n:5},
        "listField1.QGCZAuu":{corr: -Infinity,n:5},"listField1.ArhXkNR":{corr: -Infinity,n:5},"listField1.k":{corr: -Infinity,n:5},
        "listField1.xobYLm":{corr: -Infinity,n:5},"listField1.zjGXQWOauP":{corr: -Infinity,n:5},"listField1.KOAPYYwkePh":{corr: -Infinity,n:5},
        "listField1.Tn":{corr: -Infinity,n:5},"listField1.lvlTjphyw":{corr: -Infinity,n:5},"listField1.TwfsK":{corr: -Infinity,n:5},
        "listField1.EpaufavaeeEG":{corr: -Infinity,n:5},"listField1.r":{corr: -Infinity,n:5},"listField1.NmZSvq":{corr: -Infinity,n:5},
        "listField1.KYUFwG":{corr: -Infinity,n:5},"listField1.ulJNrxoCHc":{corr: -Infinity,n:5},"listField1.GFxmKTcTLJY":{corr: -Infinity,n:5},
        "listField1.ozIHn":{corr: -Infinity,n:5},"listField1.bxg":{corr: -Infinity,n:5},"listField1.QOJDt":{corr: -Infinity,n:5},
        "listField1.zEgrEevsuEqa":{corr: -Infinity,n:5},"listField1.Qz":{corr: -Infinity,n:5},
        "listField1.ccDyYIUc":{corr: -Infinity,n:5},"listField1.HhJ":{corr: -Infinity,n:5},"listField1.Px":{corr: -Infinity,n:5},
        "listField1.Wfp":{corr: -Infinity,n:5},"listField1.FKEmQv":{corr: -Infinity,n:5},"listField1.mjP":{corr: -Infinity,n:5},
        "listField1.euWRYLUPvjC":{corr: -Infinity,n:5},"listField1.ocdfymhL":{corr: -Infinity,n:5},
        "numberField1":{corr:-0.7014895051088776,n:10},"numberField2":{corr:0.4357993349945433,n:10}
    },
    "numberField1":{
        "stringField1.XCUXGKZ":{corr:-0.07464012755209876,n:10},"stringField1.CnwaWBTgW":{corr:-0.07464012755209876,n:10},"stringField1.JEXtu":{corr:-0.07464012755209876,n:10},"stringField1.ovlYIZvNEGH":{corr:-0.07464012755209876,n:10},"stringField1.ZDALoPKRqrE":{corr:-0.07464012755209876,n:10},"stringField1.ck":{corr:-0.07464012755209876,n:10},"stringField1.CWoz":{corr:-0.07464012755209876,n:10},"stringField1.kpTNrBoB":{corr:-0.07464012755209876,n:10},"stringField1.QsabNpsAxWHN":{corr:-0.07464012755209876,n:10},"stringField1.iph":{corr:-0.07464012755209876,n:10},"listField1.EabjwQ":{corr:-0.07464012755209876,n:10},"listField1.e":{corr:-0.07464012755209876,n:10},"listField1.qatCgD":{corr:-0.07464012755209876,n:10},"listField1.albGvprFAoz":{corr:-0.07464012755209876,n:10},"listField1.JD":{corr:-0.07464012755209876,n:10},"listField1.sIwdecDhIc":{corr:-0.07464012755209876,n:10},"listField1.GDNqLgfswKvS":{corr:-0.07464012755209876,n:10},"listField1.wfDwR":{corr:-0.07464012755209876,n:10},"listField1.HWqu":{corr:-0.07464012755209876,n:10},"listField1.HfZ":{corr:-0.07464012755209876,n:10},"listField1.JhGLLp":{corr:-0.07464012755209876,n:10},"listField1.kzJun":{corr:-0.07464012755209876,n:10},"listField1.ubx":{corr:-0.07464012755209876,n:10},"listField1.o":{corr:-0.07464012755209876,n:10},"listField1.Mx":{corr:-0.07464012755209876,n:10},"listField1.gbLvOxUZEsR":{corr:-0.07464012755209876,n:10},"listField1.US":{corr:-0.07464012755209876,n:10},"listField1.GBBndZIXpXQL":{corr:-0.07464012755209876,n:10},"listField1.FofNqIK":{corr:-0.07464012755209876,n:10},"listField1.BFP":{corr:-0.07464012755209876,n:10},"listField1.Hhvl":{corr:-0.07464012755209876,n:10},"listField1.WZnWPL":{corr:-0.07464012755209876,n:10},"listField1.KxkHTX":{corr:-0.07464012755209876,n:10},"listField1.h":{corr:-0.07464012755209876,n:10},"listField1.QGCZAuu":{corr:-0.07464012755209876,n:10},"listField1.ArhXkNR":{corr:-0.07464012755209876,n:10},"listField1.k":{corr:-0.07464012755209876,n:10},"listField1.xobYLm":{corr:-0.07464012755209876,n:10},"listField1.zjGXQWOauP":{corr:-0.07464012755209876,n:10},"listField1.KOAPYYwkePh":{corr:-0.07464012755209876,n:10},"listField1.Tn":{corr:-0.07464012755209876,n:10},"listField1.lvlTjphyw":{corr:-0.07464012755209876,n:10},"listField1.TwfsK":{corr:-0.07464012755209876,n:10},"listField1.EpaufavaeeEG":{corr:-0.07464012755209876,n:10},"listField1.r":{corr:-0.07464012755209876,n:10},"listField1.NmZSvq":{corr:-0.07464012755209876,n:10},"listField1.KYUFwG":{corr:-0.07464012755209876,n:10},"listField1.ulJNrxoCHc":{corr:-0.07464012755209876,n:10},"listField1.GFxmKTcTLJY":{corr:-0.07464012755209876,n:10},"listField1.ozIHn":{corr:-0.07464012755209876,n:10},"listField1.bxg":{corr:-0.07464012755209876,n:10},"listField1.QOJDt":{corr:-0.07464012755209876,n:10},"listField1.zEgrEevsuEqa":{corr:-0.07464012755209876,n:10},"listField1.Qz":{corr:-0.07464012755209876,n:10},"listField1.ccDyYIUc":{corr:-0.07464012755209876,n:10},"listField1.HhJ":{corr:-0.07464012755209876,n:10},"listField1.Px":{corr:-0.07464012755209876,n:10},"listField1.Wfp":{corr:-0.07464012755209876,n:10},"listField1.FKEmQv":{corr:-0.07464012755209876,n:10},"listField1.mjP":{corr:-0.07464012755209876,n:10},"listField1.euWRYLUPvjC":{corr:-0.07464012755209876,n:10},"listField1.ocdfymhL":{corr:-0.07464012755209876,n:10},"numberField2":{corr:-0.4594446427674563,n:10}
    },
    "numberField2":{
        "stringField1.XCUXGKZ":{corr:-0.07963739600226212,n:10},"stringField1.CnwaWBTgW":{corr:-0.07963739600226212,n:10},
        "stringField1.ZDALoPKRqrE":{corr:-0.07963739600226212,n:10},"stringField1.ck":{corr:-0.07963739600226212,n:10},
        "stringField1.JEXtu":{corr:-0.07963739600226212,n:10},"stringField1.ovlYIZvNEGH":{corr:-0.07963739600226212,n:10},
        "stringField1.QsabNpsAxWHN":{corr:-0.07963739600226212,n:10},"stringField1.iph":{corr:-0.07963739600226212,n:10},
        "stringField1.CWoz":{corr:-0.07963739600226212,n:10},"stringField1.kpTNrBoB":{corr:-0.07963739600226212,n:10},
        "listField1.EabjwQ":{corr:-0.07963739600226212,n:10},"listField1.e":{corr:-0.07963739600226212,n:10},
        "listField1.qatCgD":{corr:-0.07963739600226212,n:10},"listField1.albGvprFAoz":{corr:-0.07963739600226212,n:10},
        "listField1.JD":{corr:-0.07963739600226212,n:10},"listField1.sIwdecDhIc":{corr:-0.07963739600226212,n:10},
        "listField1.GDNqLgfswKvS":{corr:-0.07963739600226212,n:10},"listField1.wfDwR":{corr:-0.07963739600226212,n:10},
        "listField1.HWqu":{corr:-0.07963739600226212,n:10},"listField1.HfZ":{corr:-0.07963739600226212,n:10},
        "listField1.JhGLLp":{corr:-0.07963739600226212,n:10},"listField1.kzJun":{corr:-0.07963739600226212,n:10},
        "listField1.ubx":{corr:-0.07963739600226212,n:10},"listField1.o":{corr:-0.07963739600226212,n:10},
        "listField1.Mx":{corr:-0.07963739600226212,n:10},"listField1.gbLvOxUZEsR":{corr:-0.07963739600226212,n:10},
        "listField1.US":{corr:-0.07963739600226212,n:10},"listField1.GBBndZIXpXQL":{corr:-0.07963739600226212,n:10},
        "listField1.FofNqIK":{corr:-0.07963739600226212,n:10},"listField1.BFP":{corr:-0.07963739600226212,n:10},
        "listField1.Hhvl":{corr:-0.07963739600226212,n:10},"listField1.WZnWPL":{corr:-0.07963739600226212,n:10},
        "listField1.KxkHTX":{corr:-0.07963739600226212,n:10},"listField1.h":{corr:-0.07963739600226212,n:10},
        "listField1.QGCZAuu":{corr:-0.07963739600226212,n:10},"listField1.ArhXkNR":{corr:-0.07963739600226212,n:10},
        "listField1.k":{corr:-0.07963739600226212,n:10},"listField1.xobYLm":{corr:-0.07963739600226212,n:10},
        "listField1.zjGXQWOauP":{corr:-0.07963739600226212,n:10},"listField1.KOAPYYwkePh":{corr:-0.07963739600226212,n:10},
        "listField1.Tn":{corr:-0.07963739600226212,n:10},"listField1.lvlTjphyw":{corr:-0.07963739600226212,n:10}
        ,"listField1.TwfsK":{corr:-0.07963739600226212,n:10},"listField1.EpaufavaeeEG":{corr:-0.07963739600226212,n:10},
        "listField1.r":{corr:-0.07963739600226212,n:10},"listField1.NmZSvq":{corr:-0.07963739600226212,n:10},
        "listField1.KYUFwG":{corr:-0.07963739600226212,n:10},"listField1.ulJNrxoCHc":{corr:-0.07963739600226212,n:10},
        "listField1.GFxmKTcTLJY":{corr:-0.07963739600226212,n:10},"listField1.ozIHn":{corr:-0.07963739600226212,n:10},
        "listField1.bxg":{corr:-0.07963739600226212,n:10},"listField1.QOJDt":{corr:-0.07963739600226212,n:10},
        "listField1.zEgrEevsuEqa":{corr:-0.07963739600226212,n:10},"listField1.Qz":{corr:-0.07963739600226212,n:10},
        "listField1.ccDyYIUc":{corr:-0.07963739600226212,n:10},"listField1.HhJ":{corr:-0.07963739600226212,n:10},
        "listField1.Px":{corr:-0.07963739600226212,n:10},"listField1.Wfp":{corr:-0.07963739600226212,n:10},
        "listField1.FKEmQv":{corr:-0.07963739600226212,n:10},"listField1.mjP":{corr:-0.07963739600226212,n:10},
        "listField1.euWRYLUPvjC":{corr:-0.07963739600226212,n:10},"listField1.ocdfymhL":{corr:-0.07963739600226212,n:10}
    }
};

export const shortCorrelations: Correlations = {
    "stringField1":{"listField1":null},
    "listField1":{"stringField1":null},
    "binaryField1":{"listField1.ocdfymhL":{corr: -Infinity,n:5},"numberField1":{corr:-0.7014895051088776,n:10},"numberField2":{corr:0.4357993349945433,n:10}},
    "numberField1":{"stringField1.XCUXGKZ":{corr:-0.07,n:10},"numberField2":{corr:-0.4594446427674563,n:10},"stringField1.zEgrEevsuEqa":{corr:5.35,n:10}},
    "numberField2":{"stringField1.XCUXGKZ":{corr:1.0,n:10},"stringField1.CnwaWBTgW":{corr:0.75,n:10},"stringField1.JEXtu":{corr:-0.3,n:10}}
};