//Main API endpoint
import dotenv from "dotenv";
import { solarService } from "./services/solarService.js";
import { optimizer } from "./services/optimizer.js";
import {financialEngine} from "./services/financialCalculator.js";
import {getCachedEstimate} from "./services/cacheService.js"
import {saveEstimate} from "./services/cacheService.js"

dotenv.config();
app.post("/api/fetchSolarEstimate", async (req, res) => {
    try {
        const {lat, lng, monthlyElectricityBill,
            monthlyEnergyUsageKwh,} = req.body;
        //check cache
        const cached = await getCachedEstimate(lat, lng, monthlyElectricityBill, monthlyEnergyUsageKwh);

        if(cached) {
            console.log("Aleady in database!");
            return res.json(cached.result);
        }

        //unique inputs:
        const solar = await solarService(lat, lng);

        const optimize = await optimizer(solar.panelConfigs,monthlyElectricityBill, monthlyEnergyUsageKwh)

        const result = await financialEngine(optimize, monthlyElectricityBill, monthlyEnergyUsageKwh)

        await saveEstimate(
            lat,
            lng,
            monthlyElectricityBill,
            monthlyEnergyUsageKwh,
            result
        );

        return res.json(result);


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Unable to calculate solar estimate."
        });
    }

});

// const cached = await getCachedEstimate(lat, long, monthlyBill, monthlyElectricity);

// if(cached) {
//     console.log("Aleady in database!: ", cached.latitude);
// } else {

// const solar = await solarService(lat, long);

// const optimize = await optimizer(solar.panelConfigs,200, 1000)

// const result = await financialEngine(optimize, 200, 1000)

// console.log("final array:", result);

// await saveEstimate(
//     lat,
//     long,
//     monthlyBill,
//     monthlyElectricity,
//     result
//   );  
// }
