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
exports.getHistoricalAverageForInterval = getHistoricalAverageForInterval;
// src/services/HistoricalAverage.ts
var node_fetch_1 = require("node-fetch");
var OPENWEATHER_API_KEY = '9937e69d524ede9dc35a077528e4e15d';
var METEOSTAT_API_KEY = '8d2fdfb836msh07acb12a0b5262bp12b12ajsnf1239ae9534b';
// --- Cache simples ---
var historicalCache = {};
// --- Função para obter coordenadas da cidade ---
function getCityCoordinates(city, country) {
    return __awaiter(this, void 0, void 0, function () {
        var geoUrl, geoRes, geoData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=".concat(encodeURIComponent(city), ",").concat(encodeURIComponent(country), "&limit=1&appid=").concat(OPENWEATHER_API_KEY);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(geoUrl)];
                case 2:
                    geoRes = _a.sent();
                    if (!geoRes.ok)
                        throw new Error("Erro na geolocaliza\u00E7\u00E3o: ".concat(geoRes.status));
                    return [4 /*yield*/, geoRes.json()];
                case 3:
                    geoData = _a.sent();
                    if (!geoData[0])
                        return [2 /*return*/, null];
                    return [2 /*return*/, { lat: geoData[0].lat, lon: geoData[0].lon }];
                case 4:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// --- Função auxiliar para gerar array de datas entre start e end ---
function getDatesBetween(startDate, endDate) {
    var dates = [];
    var current = new Date(startDate);
    while (current <= endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}
// --- Função para média histórica de um único dia ---
function getHistoricalAverageForDay(lat, lon, month, day) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, temps_1, avgMin_1, avgMax_1, startYear, endYear, temps, year, dateStr, url, res, data, err_2, avgMin, avgMax;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = "".concat(lat, "_").concat(lon, "_").concat(month, "_").concat(day);
                    if (historicalCache[cacheKey]) {
                        temps_1 = historicalCache[cacheKey];
                        avgMin_1 = temps_1.reduce(function (a, b) { return a + b.tmin; }, 0) / temps_1.length;
                        avgMax_1 = temps_1.reduce(function (a, b) { return a + b.tmax; }, 0) / temps_1.length;
                        return [2 /*return*/, { temp_min_avg: avgMin_1, temp_max_avg: avgMax_1, temp_avg: (avgMin_1 + avgMax_1) / 2 }];
                    }
                    startYear = 2023;
                    endYear = 2025;
                    temps = [];
                    year = startYear;
                    _a.label = 1;
                case 1:
                    if (!(year <= endYear)) return [3 /*break*/, 7];
                    dateStr = "".concat(year, "-").concat(String(month).padStart(2, '0'), "-").concat(String(day).padStart(2, '0'));
                    url = "https://meteostat.p.rapidapi.com/point/daily?lat=".concat(lat, "&lon=").concat(lon, "&start=").concat(dateStr, "&end=").concat(dateStr, "&units=metric");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(url, {
                            method: 'GET',
                            headers: {
                                'x-rapidapi-host': 'meteostat.p.rapidapi.com',
                                'x-rapidapi-key': METEOSTAT_API_KEY,
                            }
                        })];
                case 3:
                    res = _a.sent();
                    if (!res.ok)
                        return [3 /*break*/, 6];
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _a.sent();
                    if (data.data && data.data.length > 0) {
                        temps.push({ tmin: data.data[0].tmin, tmax: data.data[0].tmax });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    console.error("Erro na API Meteostat para ".concat(dateStr, ":"), err_2);
                    return [3 /*break*/, 6];
                case 6:
                    year++;
                    return [3 /*break*/, 1];
                case 7:
                    if (!temps.length)
                        return [2 /*return*/, null];
                    // Salva no cache
                    historicalCache[cacheKey] = temps;
                    avgMin = temps.reduce(function (a, b) { return a + b.tmin; }, 0) / temps.length;
                    avgMax = temps.reduce(function (a, b) { return a + b.tmax; }, 0) / temps.length;
                    return [2 /*return*/, { temp_min_avg: avgMin, temp_max_avg: avgMax, temp_avg: (avgMin + avgMax) / 2 }];
            }
        });
    });
}
// --- Função principal para intervalo da viagem ---
function getHistoricalAverageForInterval(city, country, startDateStr, endDateStr) {
    return __awaiter(this, void 0, void 0, function () {
        var coords, startDate, endDate, dates, MAX_CONCURRENT, results, i, batch, batchResults, validDays, tempMinAvg, tempMaxAvg, tempAvg;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCityCoordinates(city, country)];
                case 1:
                    coords = _a.sent();
                    if (!coords)
                        return [2 /*return*/, null];
                    startDate = new Date(startDateStr);
                    endDate = new Date(endDateStr);
                    dates = getDatesBetween(startDate, endDate);
                    MAX_CONCURRENT = 5;
                    results = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < dates.length)) return [3 /*break*/, 5];
                    batch = dates.slice(i, i + MAX_CONCURRENT);
                    return [4 /*yield*/, Promise.all(batch.map(function (date) { return __awaiter(_this, void 0, void 0, function () {
                            var day, month, avg, status;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        day = date.getDate();
                                        month = date.getMonth() + 1;
                                        return [4 /*yield*/, getHistoricalAverageForDay(coords.lat, coords.lon, month, day)];
                                    case 1:
                                        avg = _d.sent();
                                        status = avg ? "ok" : "no_data";
                                        return [2 /*return*/, {
                                                temp_min_avg: (_a = avg === null || avg === void 0 ? void 0 : avg.temp_min_avg) !== null && _a !== void 0 ? _a : null,
                                                temp_max_avg: (_b = avg === null || avg === void 0 ? void 0 : avg.temp_max_avg) !== null && _b !== void 0 ? _b : null,
                                                temp_avg: (_c = avg === null || avg === void 0 ? void 0 : avg.temp_avg) !== null && _c !== void 0 ? _c : null,
                                                status: status
                                            }];
                                }
                            });
                        }); }))];
                case 3:
                    batchResults = _a.sent();
                    results.push.apply(results, batchResults);
                    _a.label = 4;
                case 4:
                    i += MAX_CONCURRENT;
                    return [3 /*break*/, 2];
                case 5:
                    validDays = results.filter(function (r) { return r.status === 'ok'; });
                    if (validDays.length === 0)
                        return [2 /*return*/, null];
                    tempMinAvg = validDays.reduce(function (sum, d) { return sum + d.temp_min_avg; }, 0) / validDays.length;
                    tempMaxAvg = validDays.reduce(function (sum, d) { return sum + d.temp_max_avg; }, 0) / validDays.length;
                    tempAvg = validDays.reduce(function (sum, d) { return sum + d.temp_avg; }, 0) / validDays.length;
                    // Retorna média geral e aviso sobre confiabilidade
                    return [2 /*return*/, {
                            // temp_min_avg: tempMinAvg,
                            // temp_max_avg: tempMaxAvg,
                            temp_avg: tempAvg,
                            // days_with_data: validDays.length,
                            // total_days: results.length,
                            // reliable: validDays.length / results.length >= 0.5 // confiável se pelo menos metade dos dias tem dados
                        }];
            }
        });
    });
}
// --- Exemplo de uso ---
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var avg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Calculando média histórica geral do intervalo...");
                return [4 /*yield*/, getHistoricalAverageForInterval("Gramado", "Brasil", "2026-04-01", "2026-04-21")];
            case 1:
                avg = _a.sent();
                if (!avg) {
                    console.log("Nenhum dado histórico disponível para o intervalo.");
                }
                else {
                    console.log("Média geral da viagem:");
                    // console.log(`Temperatura mínima média: ${avg.temp_min_avg.toFixed(1)}°C`);
                    // console.log(`Temperatura máxima média: ${avg.temp_max_avg.toFixed(1)}°C`);
                    console.log("Temperatura m\u00E9dia: ".concat(avg.temp_avg.toFixed(1), "\u00B0C"));
                    // console.log(`Dias com dados: ${avg.days_with_data} de ${avg.total_days}`);
                    // if (!avg.reliable) {
                    //   console.log("Aviso: número de dias históricos insuficiente, a média pode não ser totalmente confiável.");
                    // }
                }
                return [2 /*return*/];
        }
    });
}); })();
