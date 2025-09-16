"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/runHistoricalAverage.ts
var node_fetch_1 = require("node-fetch");
var OPENWEATHER_API_KEY = '9937e69d524ede9dc35a077528e4e15d';
var METEOSTAT_API_KEY = '8d2fdfb836msh07acb12a0b5262bp12b12ajsnf1239ae9534b';
function getCityCoordinates(city, country) {
    return __awaiter(this, void 0, void 0, function () {
        var geoUrl, geoRes, geoData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=".concat(encodeURIComponent(city), ",").concat(encodeURIComponent(country), "&limit=1&appid=").concat(OPENWEATHER_API_KEY);
                    return [4 /*yield*/, (0, node_fetch_1.default)(geoUrl)];
                case 1:
                    geoRes = _a.sent();
                    return [4 /*yield*/, geoRes.json()];
                case 2:
                    geoData = _a.sent();
                    if (!geoData[0]) {
                        console.error("Cidade não encontrada");
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, { lat: geoData[0].lat, lon: geoData[0].lon }];
            }
        });
    });
}
function getHistoricalAverageForFuture(city, country, month, day) {
    return __awaiter(this, void 0, void 0, function () {
        var coords, lat, lon, startYear, endYear, tempsMin, tempsMax, year, dateStr, url, res, data, avgMin, avgMax;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCityCoordinates(city, country)];
                case 1:
                    coords = _a.sent();
                    if (!coords)
                        return [2 /*return*/, null];
                    lat = coords.lat, lon = coords.lon;
                    startYear = 2020;
                    endYear = 2025;
                    tempsMin = [];
                    tempsMax = [];
                    year = startYear;
                    _a.label = 2;
                case 2:
                    if (!(year <= endYear)) return [3 /*break*/, 6];
                    dateStr = "".concat(year, "-").concat(String(month).padStart(2, '0'), "-").concat(String(day).padStart(2, '0'));
                    url = "https://meteostat.p.rapidapi.com/point/daily?lat=".concat(lat, "&lon=").concat(lon, "&start=").concat(dateStr, "&end=").concat(dateStr, "&units=metric");
                    return [4 /*yield*/, (0, node_fetch_1.default)(url, {
                            method: 'GET',
                            headers: {
                                'x-rapidapi-host': 'meteostat.p.rapidapi.com',
                                'x-rapidapi-key': METEOSTAT_API_KEY,
                            }
                        })];
                case 3:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _a.sent();
                    if (data.data && data.data.length > 0) {
                        tempsMin.push(data.data[0].tmin);
                        tempsMax.push(data.data[0].tmax);
                    }
                    _a.label = 5;
                case 5:
                    year++;
                    return [3 /*break*/, 2];
                case 6:
                    avgMin = tempsMin.reduce(function (a, b) { return a + b; }, 0) / tempsMin.length;
                    avgMax = tempsMax.reduce(function (a, b) { return a + b; }, 0) / tempsMax.length;
                    return [2 /*return*/, {
                            date: "".concat(day, "/").concat(month),
                            temp_min_avg: avgMin,
                            temp_max_avg: avgMax
                        }];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var avg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Calculando média histórica...");
                return [4 /*yield*/, getHistoricalAverageForFuture("Novo Hamburgo", "Brasil", 10, 30)];
            case 1:
                avg = _a.sent();
                if (!avg) {
                    console.log("Nenhum dado encontrado.");
                }
                else {
                    console.log("M\u00E9dia hist\u00F3rica em ".concat(avg.date));
                    console.log("Temperatura mínima média:", avg.temp_min_avg.toFixed(1), "°C");
                    console.log("Temperatura máxima média:", avg.temp_max_avg.toFixed(1), "°C");
                }
                return [2 /*return*/];
        }
    });
}); })();
