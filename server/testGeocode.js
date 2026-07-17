import dotenv from "dotenv";
// import { geocodeAddress } from "./services/geocodingService.js";
import { solarService } from "./services/solarService.js";
import { optimizer } from "./services/optimizer.js";
import {financialEngine} from "./services/financialCalculator.js";
import {getCachedEstimate} from "./services/cacheService.js"
import {saveEstimate} from "./services/cacheService.js"

dotenv.config();

// const coords = await geocodeAddress(
//   "833 Lange St, Mundelein, IL 60060" //test w/ seibel school of cs
// );

const lat = 42.269815;
const long = -87.990755;
let monthlyBill = 205;
let monthlyElectricity = 1000;
const cached = await getCachedEstimate(lat, long, monthlyBill, monthlyElectricity);

if(cached) {

    console.log("Aleady in database!: ", cached.latitude);
} else {

const solar = await solarService(lat, long);

const optimize = await optimizer(solar.panelConfigs,200, 1000)

const result = await financialEngine(optimize, 200, 1000)

console.log("final array:", result);

await saveEstimate(
    lat,
    long,
    monthlyBill,
    monthlyElectricity,
    result
  );  
}
