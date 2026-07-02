import dotenv from "dotenv";
import { geocodeAddress } from "./services/geocodingService.js";
import { solarService } from "./services/solarService.js";
import { optimizer } from "./services/optimizer.js";
import {financialEngine} from "./services/financialCalculator.js"

dotenv.config();

const coords = await geocodeAddress(
  "833 Lange St, Mundelein, IL 60060" //test w/ seibel school of cs
);

const lat = coords.lat
const long = coords.lng

console.log(lat);

const solar = await solarService(lat, long);

console.log("Maximum Panels:", solar.maxCount);

console.log("Configurations:", solar.panelConfigs.length);

const optimize = await optimizer(solar.panelConfigs,200, 1000)

console.log(optimize);
console.log("Best configuration:", optimize);

const final_arr = await financialEngine(optimize, 200, 1000)

console.log("final array:", final_arr);