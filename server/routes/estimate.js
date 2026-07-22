//Main API endpoint
import dotenv from "dotenv";
import { solarService } from "../services/solarService.js";
import { optimizer } from "../services/optimizer.js";
import {financialEngine} from "../services/financialCalculator.js";
import {getCachedEstimate} from "../services/cacheService.js"
import {saveEstimate} from "../services/cacheService.js"
import {rasterService } from "../services/solarService.js";
import {imageToRaster} from "../services/rasterRender.js";
import {rasterRender} from "../services/rasterRender.js";
import {uploadImage} from "../services/rasterStorage.js";
import {generateSignedUrl} from "../services/rasterStorage.js";
import {randomUUID } from "crypto";
import express from "express";

const router = express.Router();

dotenv.config();
router.post("/fetchSolarEstimate", async (req, res) => {
    try {
        const {lat, lng, monthlyElectricityBill,
            monthlyEnergyUsageKwh,} = req.body;
        //check cache
        console.log("1. Request received");
        const cached = await getCachedEstimate(lat, lng, monthlyElectricityBill, monthlyEnergyUsageKwh);
        console.log("2. Cache checked");


        if(cached) {
            console.log("Request spotted in database");
            let imageUrl = null;

            if (cached.imageKey) {
                imageUrl = await generateSignedUrl(cached.imageKey);
            }

            return res.json({
                ...cached.latitude,
                ...cached.longitude,
                ...cached.result,
                imageUrl,
                ...cached.imageBounds
            }); 
        }

        //data pipeline

        const solar = await solarService(lat, lng);
        console.log("3. Solar API finished");


        const optimize = await optimizer(solar.panelConfigs,monthlyElectricityBill, monthlyEnergyUsageKwh)
        const result = await financialEngine(optimize, monthlyElectricityBill, monthlyEnergyUsageKwh)

        //image pipeline

        const imageKey = `renders/${randomUUID()}.png`;
        const annual = await rasterService(lat, lng);  
        const rasterDims = await imageToRaster(annual.annualFluxUrl);
        const imageBounds = rasterDims.imageBounds;
        const buffer = await rasterRender(rasterDims.raster, rasterDims.width, rasterDims.height);

        await uploadImage(buffer, imageKey);
        

        await saveEstimate(
            lat,
            lng,
            monthlyElectricityBill,
            monthlyEnergyUsageKwh,
            result,
            imageKey,
            imageBounds
        );
        console.log("6. Saved to database");

        const imageUrl = await generateSignedUrl(imageKey);

        return res.json({
            lat,
            lng,
            ...result,
            imageUrl,
            imageBounds,
        })



    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Unable to calculate solar estimate."
        });
    }

});

export default router;

